import { prisma } from "../../prisma";
import { redisSub } from "../redis/index";
import { getSocketIdFromEmail } from "./socketConnections";
import { io } from "../..";
// import { socketService } from '../../index'
// import { createMessage } from '../../utils/message'

type messageT = {
  to: string;
  from: string;
  message: string;
  time: number;
};

export const subscribe = async () => {
  await redisSub.subscribe("ib", (err, count) => {
    if (err) console.log(`Error while subscribing to ${"ib"}. Error: `, err);
  });

  redisSub.on("message", async (ib, message) => {
    const messageObj: messageT = JSON.parse(message);

    const sender = await prisma.user.findUnique({
      where: {
        email: messageObj.from,
      },
    });

    if (!sender) {
      console.log("sender not found");
      return;
    }

    const receiver = await prisma.user.findUnique({
      where: {
        email: messageObj.to,
      },
    });

    if (!receiver) {
      console.log("receiver not found");
      return;
    }

    const newMessage = await prisma.messages.create({
      data: {
        message: messageObj.message,
        receiverId: receiver.id,
        senderId: sender.id,
      },
    });

    const ib_user_socket_id = await getSocketIdFromEmail(messageObj.to);

    if (ib_user_socket_id) {
      console.log("sending message to: ", ib_user_socket_id);
      io.to(ib_user_socket_id).emit("ib-message-from-server", messageObj);
    }

    // socketService.replyIb(messageObj.to, messageObj.from, messageObj.message, messageObj.time)
    // console.log('the message is : ', message);

    // const reply = await createMessage(messageObj.from, messageObj.to, messageObj.message)
    // console.log(reply);
  });
};
