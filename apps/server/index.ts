import Express from "express";
import http from "http";
import { Server } from "socket.io";
import { usersRouter } from "./router/users";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth";
import { friendRouter } from "./router/friend";
import cookieParser from "cookie-parser";
import { chatRouter } from "./router/chat";
import { redisPub } from "./services/redis/index";

const app = Express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(Express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use(usersRouter);
app.use(friendRouter);
app.use(chatRouter);

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const request = socket.handshake.auth;
  // console.log("Header", request)
  // console.log('a user connected with the socket id', socket.id);

  socket.on("ib-message-from-client", (msg: any) => {
    // console.log("message from client", msg);
    try {
      redisPub.publish("ib", JSON.stringify(msg), (err, res) => {
        if (err) console.log(err);
      });
    } catch (error) {
      console.log("there is an error: ");

      console.log(error);
    }
  });
});

httpServer.listen(8080, () => {
  console.log("Server is running on port 8080");
});
