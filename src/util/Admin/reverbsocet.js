import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
import { getToken } from '../asyncstor';

// Уникальный для каждого пользователя

export default function useReverbSocket() {
  const USER_ID = 8;
  // const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLXN0YWdlLmNhcmdvZ28ucHJvL2FwaS9hdXRoL3ZlcmlmeSIsImlhdCI6MTc1MDI3NDMxOSwiZXhwIjoxNzUyODY2MzE5LCJuYmYiOjE3NTAyNzQzMTksImp0aSI6InkzQXRGSEE2VHJvekRIWUsiLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.yUi3_PhSVEFrDFM7JTFIKzpMhk74Bj4B5WcAJRsaCpU';
  
  useEffect(() => {
    const pusher = Pusher.getInstance();

    const connectPusher = async () => {
      try {
        await pusher.init({
          apiKey: 'n4ypknvwoiwrmbt6qyhv',
          cluster: '', // Reverb не использует кластеры
          wsHost: 'api-stage.cargogo.pro',
          wsPort: 82,
          // wssPort: 443,
          useTLS: false,
          enabledTransports: ['ws'],
          onConnectionStateChange,
          onEvent,
          onAuthorizer,
          onSubscriptionSucceeded,
          onSubscriptionError,
          onError,
        });
        // await pusher.init({
        //   apiKey: 'n4ypknvwoiwrmbt6qyhv',
        //   cluster: '', // Reverb не использует кластеры
        //   host: 'api-stage.cargogo.pro',
        //   potr: 82,
        //   // wssPort: 443,
        //   useTLS: false,
        //   enabledTransports: ['ws'],
        //   onConnectionStateChange,
        //   onEvent,
        //   onAuthorizer,
        //   onSubscriptionSucceeded,
        //   onSubscriptionError,
        //   onError,
        // });


        const connectResp = await pusher.connect();
        console.log('\x1b[91mconnectResp: \x1b[0m',connectResp)

        console.log('▶️ Подписываюсь на канал:', `private-App.Models.User.${USER_ID}`);
        await pusher.subscribe({
          channelName: `private-App.Models.User.${USER_ID}`,
        });

        console.log('pusher.subscribe() call', )

      } catch (e) {
        console.log('Ошибка подключения Pusher:', e);
      }
    };

    const onConnectionStateChange = (currentState, previousState) => {
      console.log(`Состояние соединения: ${previousState} → ${currentState}`);
    };

    const onEvent = (event) => {
      console.log('Событие получено:', event);

      if (event.eventName === 'user.notification') {
        Alert.alert('Уведомление', event.data.message || 'Новое сообщение');
      }
    };

    const onAuthorizer = async (channelName, socketId) => {
      console.log('🔥 onAuthorizer вызван', socketId);
      try {
        const TOKEN = await getToken() 
        const response = await fetch('http://api-stage.cargogo.pro/broadcasting/auth', {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${TOKEN}`, // Указать токен, если Laravel использует Sanctum или Passport
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channelName,
          }),
        });
        // console.log('response', response)

        const json = await response.json();
        // console.log('json', json)
        return json;
        // return {
        //       auth: 'dummy:signature'
        //     };
      } catch (e) {
        console.log('Ошибка авторизации канала:', e);
        return { auth: 'An error happened' };
      }
    };

    const onSubscriptionSucceeded = (channelName, data) => {
      console.log(`🎉 Подписка прошла успешно на канал: ${channelName}`);
    };
    const onSubscriptionError = (channelName, message, e) => {
      console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
    }

    const onError = (message, code, error) => {
      console.log(`Ошибка Pusher: ${message}, code: ${code}, error: ${error}`);
    };

    console.log('👉 init started, passing onAuthorizer:', onAuthorizer.toString());
    
    connectPusher();

    return () => {
      pusher.unsubscribe(`private-App.Models.User.${USER_ID}`);
      pusher.disconnect();
    };
  }, []);
}
