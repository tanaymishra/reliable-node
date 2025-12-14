import { Server, Socket } from "socket.io";

export class SocketManager {
    private static instance: SocketManager;
    private io: Server | null = null;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId

    private constructor() { }

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public initialize(io: Server) {
        this.io = io;

        io.on("connection", (socket: Socket) => {
            console.log("New socket connection:", socket.id);

            const userId = socket.handshake.query.userId as string;

            if (userId) {
                this.registerUser(userId, socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            }

            socket.on("disconnect", () => {
                if (userId) {
                    this.removeUser(userId);
                    console.log(`User ${userId} disconnected`);
                }
            });
        });
    }

    public registerUser(userId: string, socketId: string) {
        this.userSockets.set(userId, socketId);
    }

    public removeUser(userId: string) {
        this.userSockets.delete(userId);
    }

    public getUserSocketId(userId: string): string | undefined {
        return this.userSockets.get(userId);
    }

    public emitToUser(userId: string, event: string, data: any) {
        if (!this.io) {
            console.error("SocketIO not initialized");
            return;
        }

        const socketId = this.getUserSocketId(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
            return true;
        }
        return false;
    }

    public emitToAll(event: string, data: any) {
        if (!this.io) {
            console.error("SocketIO not initialized");
            return;
        }
        this.io.emit(event, data);
    }
}

export const socketManager = SocketManager.getInstance();
