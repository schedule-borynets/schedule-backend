import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { SubjectSchedule } from 'src/subject-schedule/schemas/subject-schedule.schema';

import { User } from 'src/user/schemas/user.schema';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop([
    { type: SchemaTypes.ObjectId, ref: SubjectSchedule.name, default: [] },
  ])
  subjectSchedules: Types.ObjectId[];

  @Prop({ required: true })
  text: string;

  @Prop({ default: null })
  color: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
