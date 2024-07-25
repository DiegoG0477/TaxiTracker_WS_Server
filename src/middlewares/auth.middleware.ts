import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

const secretJWT = process.env.SECRET_JWT ?? 'secret';

const { verify } = jwt;

const verifyJWT = (socket: Socket, next: any) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.access_token;

        console.log('token', token);
        
        //(kitId is important to connect the client to the correct room)
        // const kitId = socket.handshake.auth?.kitId;

        /**
        Client side:
        const socket = io("http://localhost:3000", {
            auth: {
                token: "tokenGeneradoEnLogin",
                kitId: "kitId"
            }
        });
        */

        if (!token) {
            next(new Error("Unauthorized access without jwt token"));
        }
        
        verify(token, secretJWT, (err: any, decode:any) => {
            if (err) {
                next(err);
            }
            
            next();
        });
    } catch (error) {  
        next(error);
    }
}

export { verifyJWT as socketioAuthMiddleware }