import { Sector } from 'src/sectores/sectores.interface';
import { User } from 'src/users/schemas/users.chema';

enum TurnoEstado {
  PENDIENTE = 'pendiente',
  ATENDIENDO = 'atendiendo',
  FINALIZADO = 'finalizado',
}

export interface Turno{
  id?: string;
  numero?: number;
  fecha: Date;
  hora: Date;
  horaAtencion: Date;
  sector: Sector;
  user: User;
  estado: TurnoEstado
  demoraAtencion: number;
  duracionAtencion: number;
  pendientes?: number;
}
