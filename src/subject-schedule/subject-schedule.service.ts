import { Injectable } from '@nestjs/common';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubjectSchedule,
  SubjectScheduleDocument,
} from 'src/subject-schedule/schemas/subject-schedule.schema';
import { Model, Types } from 'mongoose';
import { GroupService } from 'src/group/group.service';
import axios from 'axios';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/teacher/teacher.service';
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

  // async copyAllToDB() {
  //   const errors = [];
  //   let i = 0;

  //   const teachers = await this.teacherService.findAll();
  //   for (const teacher of teachers) {
  //     console.log(i);
  //     i++;
  //     console.log(teacher);

  //     await wait(2000);
  //     try {
  //       const lessons = await axios.get(
  //         `https://schedule.kpi.ua/api/schedule/lecturer?lecturerId=${teacher.apiId}`,
  //       );

  //       const { scheduleFirstWeek, scheduleSecondWeek } = lessons.data.data;
  //       const weeks = [scheduleFirstWeek, scheduleSecondWeek];
  //       console.log('weeks', weeks);

  //       weeks.map(async (week, index) => {
  //         for (const schedule of week) {
  //           if (schedule.pairs.length === 0) {
  //             return;
  //           }
  //           for (const pair of schedule.pairs) {
  //             let subjectInDb = await this.subjectService.findOneByName(
  //               pair.name,
  //             );
  //             if (!subjectInDb) {
  //               subjectInDb = await this.subjectService.create({
  //                 name: pair.name,
  //               });
  //             } else {
  //               const subjectSchedule = await this.subjectScheduleModel
  //                 .findOne({
  //                   subject: subjectInDb.id,
  //                   day: schedule.day,
  //                   time: pair.time,
  //                   week: index,
  //                 })
  //                 .exec();

  //               if (!subjectSchedule) {
  //                 const groupRegex = /([^\(]+)(?=\()/g;
  //                 const facultyRegex = /[^\(]+(?=\))/g;

  //                 const groups = pair.group.split(',');

  //                 const groupIds = Promise.all(
  //                   groups.map(async (g) => {
  //                     const group = g.match(groupRegex);
  //                     const faculty = g.match(facultyRegex);

  //                     const groupInDb =
  //                       await this.groupService.findOneByNameAndFaculty(
  //                         group ? group[0] : '',
  //                         faculty ? faculty[0] : '',
  //                       );
  //                     if (groupInDb) {
  //                       return groupInDb.id;
  //                     }
  //                   }),
  //                 );

  //                 const res2 = await groupIds;

  //                 const createSubjectScheduleDto: CreateSubjectScheduleDto = {
  //                   subject: subjectInDb.id,
  //                   time: pair.time,
  //                   day: schedule.day,
  //                   week: index,
  //                   lessonType: pair.type,
  //                   location: pair.place,
  //                   teacher: teacher.id,
  //                   groups: res2,
  //                 };

  //                 this.subjectScheduleModel.create(createSubjectScheduleDto);
  //               }
  //             }
  //           }
  //         }
  //       });
  //     } catch (err) {
  //       errors.push(i);
  //       console.log('Err i', i);
  //       console.log('ERROR:', err);
  //     }
  //   }
  // }

  async copyAllToDB() {
    const errors = [];
    let i = 0;
    const teachers = await this.teacherService.findAll();

    for (const teacher of teachers.slice(1)) {
      console.log(i);
      i++;
      console.log('teacher', teacher.id, teacher.name, teacher.apiId);

      // Assuming there's a wait function defined somewhere else in your code
      await wait(1000);

      try {
        const lessons = await axios.get(
          `https://schedule.kpi.ua/api/schedule/lecturer?lecturerId=${teacher.apiId}`,
        );

        const { scheduleFirstWeek, scheduleSecondWeek } = lessons.data.data;
        const weeks = [scheduleFirstWeek, scheduleSecondWeek];
        console.log('weeks', JSON.stringify(weeks, null, 2));

        for (let index = 0; index < weeks.length; index++) {
          const week = weeks[index];

          for (const schedule of week) {
            if (schedule.pairs.length === 0) {
              continue;
            }

            for (const pair of schedule.pairs) {
              let subjectInDb = await this.subjectService.findOneByName(
                pair.name,
              );
              if (!subjectInDb) {
                subjectInDb = await this.subjectService.create({
                  name: pair.name,
                });
              } else {
                const subjectSchedule = await this.subjectScheduleModel
                  .findOne({
                    subject: subjectInDb.id,
                    day: schedule.day,
                    time: pair.time,
                    week: index,
                  })
                  .exec();

                if (!subjectSchedule) {
                  const groupRegex = /([^\(]+)(?=\()/g;
                  const facultyRegex = /[^\(]+(?=\))/g;
                  const groups = pair.group.split(',');

                  const groupIds = await Promise.all(
                    groups.map(async (g) => {
                      const group = g.match(groupRegex);
                      const faculty = g.match(facultyRegex);

                      const groupInDb =
                        await this.groupService.findOneByNameAndFaculty(
                          group ? group[0] : '',
                          faculty ? faculty[0] : '',
                        );

                      if (groupInDb) {
                        return groupInDb.id;
                      }
                    }),
                  );

                  const createSubjectScheduleDto: CreateSubjectScheduleDto = {
                    subject: subjectInDb.id,
                    time: pair.time,
                    day: schedule.day,
                    week: index,
                    lessonType: pair.type,
                    location: pair.place,
                    teacher: teacher.id,
                    groups: groupIds,
                  };

                  await this.subjectScheduleModel.create(
                    createSubjectScheduleDto,
                  );
                }
              }
            }
          }
        }
      } catch (err) {
        errors.push({ i, teacherId: teacher.apiId });
        console.log('Err i', i, 'Teacher Id:', teacher.apiId);
        console.log('ERROR:', err);
      }
    }
  }
}
