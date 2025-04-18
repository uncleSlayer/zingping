import Express from "express";
import http from "http";
import { Server } from "socket.io";
import { usersRouter } from "./router/users";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth";
import { friendRouter } from "./router/friend";
import cookieParser from "cookie-parser";
import { chatRouter } from "./router/chat";
import { redisPub, redisSub } from "./services/redis/index";
import { subscribe } from "./services/redis/handleRedisSub";
import { setSocketConnections } from "./services/redis/socketConnections";

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

async function startServer() {
  try {
    await subscribe();

    io.on("connection", (socket) => {
      const socketClientId = socket.id;

      console.log("connected socket: ", socketClientId);

      const clientAuthenticatedEmail = socket.handshake.auth.email;

      setSocketConnections(socketClientId, clientAuthenticatedEmail);

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
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();

// testing10