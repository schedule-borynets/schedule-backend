import { ObjectId } from 'mongoose';

export class CreateTeacherDto {
  name: string;
  subjects: ObjectId[];
}
