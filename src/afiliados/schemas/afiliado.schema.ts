import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AfiliadoDocument = Afiliado & Document;

@Schema({ timestamps: true })
export class Afiliado {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  dni: string;

  @Prop()
  telefono?: string;

  @Prop()
  email?: string;
}

export const AfiliadoSchema = SchemaFactory.createForClass(Afiliado);