import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Sector } from 'src/sectores/schemas/sectores.schema';
import { User } from 'src/users/schemas/users.chema';

export enum EstadoTurno {
  PENDIENTE = 'pendiente',
  ATENDIENDO = 'atendiendo',
  FINALIZADO = 'finalizado'
}

export type TurnoDocument = HydratedDocument<Turno>;

@Schema({ validateBeforeSave: true, versionKey: false })
@Schema()
export class Turno {

  @IsOptional()
  @Prop({ type: Types.ObjectId, ref: 'Afiliado', required: true })
  afiliadoId: Types.ObjectId;

  @IsString()
  @IsOptional()
  @Prop()
  id: String;

  @Prop({type: Number, min: 1})
  numero: Number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true})
  sector: Sector

  @Prop({ type: String, enum: EstadoTurno, default: EstadoTurno.PENDIENTE })
  estado: EstadoTurno

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop({default: Date.now, index: true})
  fecha: Date;

  @Prop({default: Date.now, index: true})
  hora: Date;

  @Prop({default: null})
  horaAtencion: Date;

  @Prop({default: null})
  horaFinalizado: Date;

  @Prop({type: Number})
  demoraAtencion: Number;

  @Prop({type: Number})
  duracionAtencion: Number;

  @IsString()
  @IsOptional()
  @Prop()
  motivo: String;
  
}

export const TurnoSchema = SchemaFactory.createForClass(Turno);
TurnoSchema.set('versionKey', false);