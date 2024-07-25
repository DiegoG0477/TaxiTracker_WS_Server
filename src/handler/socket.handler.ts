import { Server, Socket } from "socket.io";

export class WebSocketHandler {
    private packetBuffer: any[] = [];
    private isProcessing = false;
    private clientId = "default";

    constructor(private io: Server) {
        this.io.on("connection", (socket: Socket) =>
            this.handleConnection(socket)
        );
    }

    private handleConnection(socket: Socket): void {
        const kitId = socket.handshake.auth?.kitId;

        console.log("Client connected.");
        console.log("User ID subscription:");

        if (kitId !== undefined) {
            socket.join(kitId);
        }

        this.registerSocketEvents(socket);
    }

    private registerSocketEvents(socket: Socket): void {
        socket.on("refresh:kit_location", (data) =>
            this.handleRefreshKitLocation(data)
        );

        socket.on("connect_error", (err) => {
            console.log("Connection error:", err);
            this.handleConnectError(err);
        });
    }

    private handleRefreshKitLocation(data: any): void {
        this.clientId = data.kit_id;
        this.enqueuePacket({ event: "refresh:kit_location", data });
        this.processNextPacket();
    }

    private handleConnectError(err: any): void {
        console.log(err.message);
        console.log(err.description);
        console.log(err.context);
    }

    private enqueuePacket(packet: any): void {
        this.packetBuffer.push(packet);
    }

    private processNextPacket(): void {
        if (this.packetBuffer.length > 0 && !this.isProcessing) {
            this.isProcessing = true;
            const packet = this.packetBuffer.shift();
            this.handlePacket(packet);
        }
    }

    private handlePacket(packet: any): void {
        const { event, data } = packet;

        console.log("to kit:", this.clientId);
        console.log(`Processing event ${event} with data:`, data);

        this.io.to(this.clientId).emit(event, data);
        this.isProcessing = false;
        this.processNextPacket();
    }
}