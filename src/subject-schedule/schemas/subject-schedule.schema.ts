import { Subject } from 'src/subject/schemas/subject.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Group } from 'src/group/schemas/group.schema';
import { Teacher } from 'src/teacher/schemas/teacher.schema';

export type SubjectScheduleDocument = SubjectSchedule & Document;

@Schema()
export class SubjectSchedule {
  @Prop({ type: SchemaTypes.ObjectId, ref: Subject.name, default: null })
  subject: string;

  @Prop({ type: String })
  time: string;

  @Prop({ type: String })
  day: string;

  @Prop({ type: Number })
  week: number;

  @Prop({ type: String })
  lessonType: string;

  @Prop({ type: String })
  location: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Teacher.name,
    default: null,
  })
  teacher: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Group.name, default: [] }])
  groups: string[];
}

export const SubjectScheduleSchema =
  SchemaFactory.createForClass(SubjectSchedule);
