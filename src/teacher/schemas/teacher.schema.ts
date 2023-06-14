import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Subject } from 'src/subject/schemas/subject.schema';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher {
  @Prop()
  name: string;

  @Prop()
  apiId: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
