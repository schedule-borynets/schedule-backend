import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { SubjectSchedule } from 'src/subject-schedule/schemas/subject-schedule.schema';

import { User } from 'src/user/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SubjectSchedule.name,
    required: true,
  })
  subjectSchedule: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.Date })
  creationTime: Date;

  @Prop({ default: null, type: SchemaTypes.Date })
  endTime: Date;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ required: true })
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
