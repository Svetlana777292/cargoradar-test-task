import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { getToken } from '../asyncstor';

// Уникальный для каждого пользователя
// const USER_ID = 8;
// const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLXN0YWdlLmNhcmdvZ28ucHJvL2FwaS9hdXRoL3ZlcmlmeSIsImlhdCI6MTc1MDI3MTk1NiwiZXhwIjoxNzUyODYzOTU2LCJuYmYiOjE3NTAyNzE5NTYsImp0aSI6IkFpU1hpcThVWGJxbWZCOHUiLCJzdWIiOiI4IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.I5zKjYQUvKqGfoRb_LSFNLTVQ2LItZiaxlJVU4wECaA';

export default function useReverbSocketAnother() {
  const USER_ID = '2';
  // const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLXN0YWdlLmNhcmdvZ28ucHJvL2FwaS9hdXRoL3ZlcmlmeSIsImlhdCI6MTc1MDI3NDMxOSwiZXhwIjoxNzUyODY2MzE5LCJuYmYiOjE3NTAyNzQzMTksImp0aSI6InkzQXRGSEE2VHJvekRIWUsiLCJzdWIiOiIyIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.yUi3_PhSVEFrDFM7JTFIKzpMhk74Bj4B5WcAJRsaCpU';
  
//   useEffect(() => {
//   const emitter = new NativeEventEmitter(NativeModules.PusherWebsocketReactNative);
//   const sub = emitter.addListener('PusherReactNative:onAuthorizer', (event) => {
//     console.log('📡 iOS ВЫЗЫВАЕТ onAuthorizer:', event);
//   });

//   return () => {
//     sub.remove();
//   };
// }, []);

  useEffect(() => {
    const pusher = Pusher.getInstance();

    // const emitter = new NativeEventEmitter(NativeModules.PusherWebsocketReactNative);

    // const subscription = emitter.addListener('PusherReactNative:onAuthorizer', (event) => {
    //   console.log('📡 Событие от iOS пришло в onAuthorizer:', event);
    // });

    const connectPusher = async () => {
      // const TOKEN = await getToken() 
      try {
        await pusher.init({
          apiKey: 'n4ypknvwoiwrmbt6qyhv',
          cluster: '',
          wsHost: 'api-stage.cargogo.pro',
          wsPort: 82,
          wssPort: 443,
          forceTLS: false,
          enabledTransports: ['ws'],
          onConnectionStateChange: async (currentState, previousState) => {
            console.log(`Состояние соединения: ${previousState} → ${currentState}`);
          },
          onAuthorizer: async (channelName, socketId) => {
            console.log('🔥 onAuthorizer вызван');
            console.log('socketId', socketId);
            return {
              auth: 'dummy:signature',
            };
          },
          // onAuthorizer: async (channelName, socketId) => {
          //   console.log('🔥 onAuthorizer вызван');
          //   console.log('socketId', socketId);
          //   console.log('channelName', channelName);

          //   try {
          //     const res = await fetch('http://api-stage.cargogo.pro/broadcasting/auth', {
          //       method: 'POST',
          //       headers: {
          //         'Content-Type': 'application/json',
          //         'Authorization': `Bearer ${TOKEN}`,
          //       },
          //       body: JSON.stringify({ socket_id: socketId, channel_name: channelName }),
          //     });

          //     const json = await res.json();
          //     return json;
          //   } catch (e) {
          //     console.log('❌ Ошибка в onAuthorizer', e);
          //     return {};
          //   }
          // },
          
          onSubscriptionSucceeded: (channelName, data) => {
            console.log(`🎉 Подписка прошла успешно на канал: ${channelName}`, data);
          },
          onEvent: (event) => {
            console.log('Событие получено:', event);

            if (event.eventName === 'user.notification') {
              Alert.alert('Уведомление', event.data.message || 'Новое сообщение');
            }
          },
          onSubscriptionError: (channelName, message, e) => {
            console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
          },
          onError: (message, code, error) => {
            console.log(`Ошибка Pusher: ${message}, code: ${code}, error: ${error}`);
          },
        });


        await pusher.connect();
        const socketId = await pusher.getSocketId();
        console.log('🆔 socketId:', socketId);

        // console.log('▶️ Подписываюсь на канал:', `private-App.Models.User.${USER_ID}`);
        // await pusher.subscribe({
        //   channelName: `private-App.Models.User.${USER_ID}`,
        //   onSubscriptionError: (channelName, message, e) => {
        //     console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
        //   },
        //   onSubscriptionSucceeded: (channelName, data) => {
        //     console.log(`🎉 Подписка прошла успешно на канал: ${channelName}`, data);
        //   },
        // });

        // console.log('pusher.subscribe() call', )

      } catch (e) {
        console.log('Ошибка подключения Pusher:', e);
      }
    };

    try {
      
      connectPusher();
    } catch (error) {
      console.log('error123', error )
    }

    return () => {
      // subscription.remove(); 
      pusher.unsubscribe(`private-App.Models.User.${USER_ID}`);
      pusher.disconnect();
    };
  }, []);
}
