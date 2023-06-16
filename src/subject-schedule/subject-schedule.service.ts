import { Injectable } from '@nestjs/common';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubjectSchedule,
  SubjectScheduleDocument,
} from 'src/subject-schedule/schemas/subject-schedule.schema';
import { Model } from 'mongoose';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class SubjectScheduleService {
  constructor(
    @InjectModel(SubjectSchedule.name)
    private subjectScheduleModel: Model<SubjectScheduleDocument>,
    private readonly groupService: GroupService,
    private readonly subjectService: SubjectService,
    private readonly teacherService: TeacherService,
  ) {}
  create(createSubjectScheduleDto: CreateSubjectScheduleDto) {
    const createdSubject = new this.subjectScheduleModel(
      createSubjectScheduleDto,
    );
    return createdSubject.save();
  }

  findAll() {
    return this.subjectScheduleModel.find().exec();
  }
  findAllByGroup(id: string) {
    return this.subjectScheduleModel
      .find({ groups: { $in: [id] } })
      .populate('groups')
      .populate('teacher')
      .populate('subject')
      .exec();
  }

  findAllByTeacher(id: string) {
    return this.subjectScheduleModel
      .find({ teacher: id })
      .populate('groups')
      .populate('teacher')
      .populate('subject')
      .exec();
  }

  findOne(id: string) {
    return this.subjectScheduleModel.findById(id).exec();
  }

  update(id: string, updateSubjectScheduleDto: UpdateSubjectScheduleDto) {
    return this.subjectScheduleModel
      .findByIdAndUpdate(id, updateSubjectScheduleDto, {
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.subjectScheduleModel.findByIdAndDelete(id).exec();
  }
}
