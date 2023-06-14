import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { SubjectSchedule } from 'src/subject-schedule/schemas/subject-schedule.schema';

import { User } from 'src/user/schemas/user.schema';

export type LinkDocument = Link & Document;

@Schema()
export class Link {
  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SubjectSchedule.name,
    required: true,
  })
  subjectSchedule: Types.ObjectId;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
