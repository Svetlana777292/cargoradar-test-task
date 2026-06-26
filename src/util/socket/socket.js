import { setCurrentChatMsgState, setCurrentChatReplState, setTenderInformersState, setwsErr, setwsStatus } from "../../store/features/listOfChatsSlice";
import { setCheckUpdFormActivities, setUserFormsActivities, setUserFormsHiddenTenders } from "../../store/features/loginSlice";
import { SOCKET_VARS } from "../apiVars";
import { getToken } from "../asyncstor";


  export const connectSocket = async (user,socketRef,currChatId,dispatch) => {
    const TOKEN = await getToken()
    const CHANNEL_NAME = `private-App.Models.User.${user.id}`; // замените на нужный канал
    const PING_INTERVAL_MS = 30000; // 30 секунд


    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    // Шаг 1: Подключение к сокету
    const ws = new WebSocket(`${SOCKET_VARS.SCHEME}://${SOCKET_VARS.WS_HOST}:${SOCKET_VARS.WS_PORT}/app/${SOCKET_VARS.APP_KEY}?protocol=7&client=js&version=4.3.1&flash=false`);
    socketRef.current = ws;

    let pingInterval = null;

    ws.onopen = async () => {
      console.log('✅ WebSocket открыт');
      dispatch(setwsStatus('open'))
      //ping-pong
      pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'pusher:ping' }));
          // console.log('📡 Ping отправлен');
        }
      }, PING_INTERVAL_MS);


      // Шаг 2: Получение socket_id из сообщения pusher:connection_established
      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.event === 'pusher:connection_established') {
          const payload = JSON.parse(data.data);
          const socketId = payload.socket_id;
          // console.log('🔗 socket_id:', socketId);

          // Шаг 3: Авторизация
          const response = await fetch(SOCKET_VARS.AUTH_URL, {
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
          // console.log('🔐 Auth data:', authData);

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
        console.log('\x1b[46m%s %s\x1b[0m','📨 data event&data:',data?.event, data)
        if (data.event && data.channel === CHANNEL_NAME) {
          // console.log('📨 Message from channel:', data);

          //event Messages
          if(data.event === "MessageSent") {
            const objMsg = JSON.parse(data.data)
            const safeMessage = JSON.parse(JSON.stringify(objMsg))
            // console.log('safeMessage', safeMessage)
            // console.log('safeMessage.message', Object.isFrozen(safeMessage.message)  )
            //проверять роль - что бы соответствовала текущей
            if(safeMessage.message.partnerRole === user.role) {

              // если в чате с юзером то в стейт чата
              // console.log('currChatId', currChatId)
              if(currChatId !== null && safeMessage.message.tenderId === currChatId.tenderId && safeMessage.message.userId === currChatId.userId) {
                dispatch(setCurrentChatMsgState(safeMessage.message))
              } else {
                dispatch(setTenderInformersState(safeMessage.message))
                //если нет - то в информер в редакс
                // console.log('send to informer state', )
                if(user.role === 'driver') {
                  if(safeMessage.message.textSystem === 'acceptTenderByClient') {
                    dispatch(setCheckUpdFormActivities(safeMessage.message.tenderId))
                  }
                  //для офера тоже чекать тут
                }
              }
            }
            
          }
          if(data.event === "ReplySent") {
            const objRpl = JSON.parse(data.data)
            const safeRpl = JSON.parse(JSON.stringify(objRpl))
            // console.log('safeRpl', safeRpl)
            // console.log('safeRpl.message', Object.isFrozen(safeRpl.message))
            //проверять роль - что бы соответствовала текущей
            
            //юзер в чате нужной заявки
            // console.log('currChatId', currChatId)
            if(currChatId !==null && safeRpl.message.tenderId === currChatId.tenderId) {
              //если айди партнера равен айди чатюзера то в стейт
              //если нет то ничего не делать так как обновится лист ставок из стейта сообщений
              let partner = user.role === 'driver' ? safeRpl.message.clientId : safeRpl.message.userId
              //todo проверить коректного юзера
              if(partner=== currChatId.userId) {
                dispatch(setCurrentChatReplState(safeRpl.message))
              }
            } else {
              //user not in chatscreen
              // send to state
              // dispatch(setTenderInformersState(safeRpl.message))
            }
            
          }
          if(data.event === "FormUpdateSent") {
            const objForm = JSON.parse(data.data)
            const safeForm = JSON.parse(JSON.stringify(objForm))
            // console.log('safeForm', safeForm)
            // console.log('safeForm.message', Object.isFrozen(safeForm.message))
            //проверять роль - что бы соответствовала текущей
            dispatch(setUserFormsHiddenTenders(safeForm.message))
            dispatch(setUserFormsActivities({
              "clientActiveTender": safeForm.message.clientActiveTender,
              "driverActiveTender": safeForm.message.driverActiveTender,
              "driverRoutesOffers": safeForm.message.driverRoutesOffers,
              "driverTenderActivity": safeForm.message.driverTenderActivity
            }))
          }
        }

        if (data.event === 'pusher:pong') {
          // console.log('💓 Pong получен от сервера');
        }
      };
    };

    ws.onerror = (e) => {
      console.log('❌ WebSocket ошибка:', e.message);
      dispatch(setwsErr(e.message))
      dispatch(setwsStatus('close'))
    };

    ws.onclose = () => {
      console.log('❎ WebSocket закрыт');
      dispatch(setwsStatus('close'))
      if (pingInterval) {
        clearInterval(pingInterval);
      };
    }
    
    
  };