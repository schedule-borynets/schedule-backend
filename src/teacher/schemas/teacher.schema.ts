import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher {
  @Prop()
  name: string;

  @Prop()
  apiId: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
