import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Pusher } from '@pusher/pusher-websocket-react-native';


export default function useReverbSocketEcho() {
  const USER_ID = '2';
  const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLXN0YWdlLmNhcmdvZ28ucHJvL2FwaS9hdXRoL3ZlcmlmeSIsImlhdCI6MTc1MDMzMzkyNCwiZXhwIjoxNzUyOTI1OTI0LCJuYmYiOjE3NTAzMzM5MjQsImp0aSI6IklQYlFSbVRNTXN0SHM5b2oiLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.KMA2vxNjDBhGjjdY139nbjJPZAhEbzYm1Jd4Nq6B-7Q'

useEffect(() => {
    const pusher = Pusher.getInstance();

    const connect = async () => {
      await pusher.init({
        apiKey: 'n4ypknvwoiwrmbt6qyhv',
        cluster: '',
        wsHost: 'api-stage.cargogo.pro',
        wsPort: 82,
        wssPort: 443,
        forceTLS: false,
        enabledTransports: ['ws'],
      });

      pusher.setAuth({
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      await pusher.connect();

      await pusher.subscribe({
        channelName: `private-App.Models.User.${USER_ID}`,
      });

      pusher.bind('user.notification', (event) => {
        const data = JSON.parse(event.data);
        console.log('📩 Уведомление:', data);
        Alert.alert('Уведомление', data.message || 'Новое сообщение');
      });
    };

    connect();

    return () => {
      pusher.unsubscribe(`private-App.Models.User.${USER_ID}`);
      pusher.disconnect();
    };
  }, []);
}
