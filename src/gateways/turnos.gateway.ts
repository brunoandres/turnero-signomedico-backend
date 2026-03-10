import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SubscribeMessage } from '@nestjs/websockets';
import { TurnosService } from '../turnos/turnos.service';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Turno } from '../turnos/schemas/turnos.schema';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: ['https://turnero-cipbyte.vercel.app'],
    credentials: true,
  },
})
export class TurnosGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('Servidor WebSocket iniciado');
  }

  enviarActualizacion(turnos: any) {
    this.server.emit('actualizacion-turnos', turnos);
  }

  @SubscribeMessage('event_message')
  handleIncommingMessage(client: Socket, payload: any) {
    this.server.emit('new_message', payload);
  }

  @SubscribeMessage('catch-error')
  handleCatchError(client: Socket, payload: any): void {
    try {
      // lógica
    } catch (error) {
      client.emit('error', { message: 'Ocurrió un error en el servidor' });
    }
  }
}
