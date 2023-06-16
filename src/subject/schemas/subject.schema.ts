import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Time {
  week: number;
  time: string;
}

export type SubjectDocument = Subject & Document;

@Schema()
export class Subject {
  @Prop({ required: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
