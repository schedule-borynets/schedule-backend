import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Group } from 'src/group/schemas/group.schema';
import { SubjectSchedule } from 'src/subject-schedule/schemas/subject-schedule.schema';
import { Teacher } from 'src/teacher/schemas/teacher.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: null })
  scheduleType: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Group.name, default: null })
  group: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Teacher.name, default: null })
  teacher: Types.ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: SubjectSchedule.name }])
  hiddenSubjects: SubjectSchedule[];
}

export const UserSchema = SchemaFactory.createForClass(User);
