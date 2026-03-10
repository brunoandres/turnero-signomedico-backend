import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SubscribeMessage } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: ['https://turnero-cipbyte.vercel.app']
  },
})
export class TurnosGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  //constructor(private turnoService: TurnosService) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: any, ...args: any[]) {
    /*const count = await this.turnoService.countDocuments();
    if (count === 0) {
      this.server.emit('database-empty', { message: 'The database is currently empty' });
    }*/
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('Servidor WebSocket iniciado:');
  }

  enviarActualizacion(turnos: any) {
    //console.log('recibiendo actualización: ', turnos)
    this.server.to('actualizacion-turnos');
  }

  @SubscribeMessage('event_message') //TODO Backend
  handleIncommingMessage(
    client: Socket,
    id: { id: string },
  ) {
    this.server.to('Enviando actualización desde el backend').emit('new_message');
  }

  @SubscribeMessage('catch-error')
  handleCatchError(client: Socket, payload: any): void {
    try {
      // Hacer algo aquí que pueda generar un error
    } catch (error) {
      client.emit('error', { message: 'Ocurrió un error en el servidor' });
    }
  }
}
