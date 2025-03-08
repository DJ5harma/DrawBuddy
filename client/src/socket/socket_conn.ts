import { io, Socket } from "socket.io-client";
import { CanvasManager } from "../canvas_system/Managers/CanvasManager";
import { Shape } from "../canvas_system/Shapes/Shape";
import { Circle } from "../canvas_system/Shapes/Circle";
import { Rectangle } from "../canvas_system/Shapes/Rectangle";
import { Line } from "../canvas_system/Shapes/Line";
import { Pencil } from "../canvas_system/Shapes/Pencil";

export class SocketConn {
    public static socket: Socket;

    public static getRoomIdFromURL(): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get("room");
    }

    public static init() {
        this.socket = io("http://localhost:6005");

        this.socket.on("connect", () => {
            console.log("Connected to the server with id:", this.socket.id);

            const roomId = this.getRoomIdFromURL();
            console.log("room : ", roomId);

            if (roomId) {
                this.socket.emit("joinRoom", roomId);
            }
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from the server");
        });

        this.socket.on("joined", (roomId) => {
            this.socket.emit(
                "Initial_Canvas",
                CanvasManager.get_shapes(),
                roomId
            );
            console.log("Shapes : ", CanvasManager.get_shapes());
        });

        this.socket.on("initialCanvasState", (shapes) => {
            console.log("shapes in intialCanvasState : ", shapes);

            shapes.forEach((shape: any) => {
                let shapeInstance: Shape;
                if (shape.shapeInstance === "CIRCLE") {
                    shapeInstance = new Circle();
                } else if (shape.shapeInstance === "RECTANGLE") {
                    shapeInstance = new Rectangle();
                } else if (shape.shapeInstance === "LINE") {
                    shapeInstance = new Line();
                }
                else{
                    shapeInstance = new Pencil();
                }
                Object.assign(shapeInstance, shape);
                CanvasManager.render_shape(shapeInstance);
            });
        });
    }

    public static getSocket(): Socket {
        return this.socket;
    }
}
