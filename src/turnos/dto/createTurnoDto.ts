import { IsDate, IsDateString, IsEnum, IsOptional } from "class-validator"
import { Sector } from "src/sectores/schemas/sectores.schema"
import { User } from "src/users/schemas/users.chema"

enum TurnoEstado {
  PENDIENTE = 'pendiente',
  ATENDIENDO = 'atendiendo',
  FINALIZADO = 'finalizado',
}

export class CreateTurnoDto {
  id?: string;
  numero?: number;
  @IsDateString()
  @IsOptional()
  fecha: Date;
  @IsOptional()
  @IsDateString()
  hora: Date;
  sector: Sector;
  user?: User;
  @IsOptional()
  @IsEnum(TurnoEstado)
  estado: TurnoEstado;
  @IsOptional()
  readonly afiliadoId: string;
  @IsOptional()
  motivo?: string;
}