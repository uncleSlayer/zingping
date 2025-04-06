import Express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { usersRouter } from './router/users';
import cors from 'cors'
import { authMiddleware } from './middlewares/auth'
import { friendRouter } from './router/friend';
import cookieParser from 'cookie-parser';

const app = Express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
}));

app.use(Express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use(usersRouter);
app.use(friendRouter);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }
}); 

io.on('connection', (socket) => {

    const request = socket.handshake.auth
    // console.log("Header", request)
    // console.log('a user connected with the socket id', socket.id);

    socket.on('ib-message-from-client', (msg: any) => {
        console.log("message from client", msg);
    }) 

});

httpServer.listen(8080, () => {
    console.log('Server is running on port 8080');
});