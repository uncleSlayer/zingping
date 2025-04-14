import { redisSub } from '../redis/index'
// import { socketService } from '../../index'
// import { createMessage } from '../../utils/message'

type messageT = {
  to: string,
  from: string,
  message: string,
  time: number
}

export const subscribe = async () => {

  await redisSub.subscribe('ib', (err, count) => {
    if (err) console.log(`Error while subscribing to ${'ib'}. Error: `, err)
  })

  redisSub.on('message', async (ib, message) => {
    console.log('the message is : ', message);
    // const messageObj: messageT = JSON.parse(message)
    // socketService.replyIb(messageObj.to, messageObj.from, messageObj.message, messageObj.time)
    // console.log('the message is : ', message);
    
    // const reply = await createMessage(messageObj.from, messageObj.to, messageObj.message)
    // console.log(reply);
    
  })
}