import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from 'src/teacher/schemas/teacher.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherDocument> {
    const createdTeacher = new this.teacherModel(createTeacherDto);
    return createdTeacher.save();
  }

  async findAll(): Promise<TeacherDocument[]> {
    return this.teacherModel.find().exec();
  }

  async findOne(id: string): Promise<Teacher> {
    return this.teacherModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Teacher> {
    return this.teacherModel.findByIdAndDelete(id).exec();
  }

  async copyAllToDB() {
    const response = await axios.get(
      'https://schedule.kpi.ua/api/schedule/lecturer/list',
    );
    const teachers = response.data.data;
    // console.log(teachers);

    teachers.forEach(async (teacher) => {
      const newTeacher = new this.teacherModel({
        name: teacher.name,
        apiId: teacher.id,
      });
      await newTeacher.save();
    });
  }
}

// const c = await this.teacherModel.collection.countDocuments();
