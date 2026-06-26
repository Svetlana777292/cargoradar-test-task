import { Pusher } from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

export const initPusher = async (token, userId, onEvent) => {
  try {
    await pusher.init({
      apiKey: 'n4ypknvwoiwrmbt6qyhv',
      cluster: '', // не нужен, так как используется custom host
      wsHost: 'api-stage.cargogo.pro',
      wsPort: 82,
      wssPort: 443,
      useTLS: false, // http (если будет https, поставь true)
      onAuthorizer,
      // auth: {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // },
      onConnectionStateChange: (state) => {
        console.log('Pusher state changed:', state, );
      },
      onConnectionStateChange: (state) => {
        console.log('Pusher state changed:', state, );
      },
      onError: (error) => {
        console.log('Pusher error:', error);
      },
      onEvent: (event) => {
        console.log('📨 Event received:', event);
        if (onEvent) onEvent(event);
      },
      onSubscriptionSucceeded: (channelName,data) => {
        console.log('Pusher onSubscriptionSucceeded:', channelName,data);
      },
      onSubscriptionError: (channelName,message,e) => {
        console.log('Pusher onSubscriptionError:', channelName,message,e);
      },
    });
    
    const channelName = `private-App.Models.User.${userId}`;
    
    await pusher.subscribe({ channelName });
    await pusher.connect();
    console.log('onEvent', onEvent)
    const socketId = await pusher.getSocketId();

    console.log('✅ Pusher connected to channel:', channelName);
  } catch (e) {
    console.log('❌ Error initializing Pusher:', e);
  }
};

export const disconnectPusher = async () => {
  try {
    await pusher.disconnect();
    console.log('👋 Pusher disconnected');
  } catch (e) {
    console.log('❌ Error disconnecting:', e);
  }
};
