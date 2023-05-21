import { Module } from '@nestjs/common';
import { SubjectScheduleService } from './subject-schedule.service';
import { SubjectScheduleController } from './subject-schedule.controller';
import { GroupModule } from 'src/group/group.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubjectSchedule,
  SubjectScheduleSchema,
} from 'src/subject-schedule/schemas/subject-schedule.schema';
import { SubjectModule } from 'src/subject/subject.module';

import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubjectSchedule.name, schema: SubjectScheduleSchema },
    ]),
    GroupModule,
    SubjectModule,
    TeacherModule,
  ],
  controllers: [SubjectScheduleController],
  providers: [SubjectScheduleService],
})
export class SubjectScheduleModule {}
