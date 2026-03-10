import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { User } from "src/users/schemas/users.chema"

export enum TurnoEstado {
  PENDIENTE = 'pendiente',
  ATENDIENDO = 'atendiendo',
  FINALIZADO = 'finalizado',
}

export class UpdateTurnoDto {
  @IsString()
  @IsOptional()
  id?: string
  @IsNotEmpty()
  user: User
  @IsEnum(TurnoEstado)
  estado: TurnoEstado;
  @IsDate()
  @IsOptional()
  horaAtencion: Date
  @IsOptional()
  horaFinalizado: Date
  demoraAtencion: number
  duracionAtencion: number
}