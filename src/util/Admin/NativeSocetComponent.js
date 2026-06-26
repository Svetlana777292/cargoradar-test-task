import React, { useEffect, useRef } from 'react';
import { Button, View, Text } from 'react-native';
import { getToken } from '../asyncstor';


export const NativeSocetComponent = () => {
  const WS_HOST = 'api-stage.cargogo.pro';
  const WS_PORT = '82';
  const APP_KEY = 'n4ypknvwoiwrmbt6qyhv';
  const SCHEME = 'ws'; // http => ws
  const CHANNEL_NAME = 'private-App.Models.User.8'; // замените на нужный канал
  const AUTH_URL = 'http://api-stage.cargogo.pro/broadcasting/auth';
  // const TOKEN = 'ваш_токен_авторизации'; // если используется авторизация через Bearer
  const socketRef = useRef(null);

  const connect = async () => {
     const TOKEN = await getToken()
    // Шаг 1: Подключение к сокету
    const ws = new WebSocket(`${SCHEME}://${WS_HOST}:${WS_PORT}/app/${APP_KEY}?protocol=7&client=js&version=4.3.1&flash=false`);
    socketRef.current = ws;

    ws.onopen = async () => {
      console.log('✅ WebSocket открыт');

      // Шаг 2: Получение socket_id из сообщения pusher:connection_established
      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.event === 'pusher:connection_established') {
          const payload = JSON.parse(data.data);
          const socketId = payload.socket_id;
          console.log('🔗 socket_id:', socketId);

          // Шаг 3: Авторизация
          const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN}`, // убери, если авторизация не нужна
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: CHANNEL_NAME,
            }),
          });

          const authData = await response.json();
          console.log('🔐 Auth data:', authData);

          // Шаг 4: Подписка на канал
          ws.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: {
                auth: authData.auth,
                channel: CHANNEL_NAME,
              },
            })
          );
        }

        // Обработка событий
        if (data.event && data.channel === CHANNEL_NAME) {
          console.log('📨 Message from channel:', data);
        }
      };
    };

    ws.onerror = (e) => {
      console.log('❌ WebSocket ошибка:', e.message);
    };

    ws.onclose = () => {
      console.log('❎ WebSocket закрыт');
    };
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Button title="Подключиться к WebSocket" onPress={connect} />
    </View>
  );
}
// export default NativeSocetComponent;
