import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectScheduleDto } from './create-subject-schedule.dto';

export class UpdateSubjectScheduleDto extends PartialType(CreateSubjectScheduleDto) {}
