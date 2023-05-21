import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from 'src/subject/schemas/subject.schema';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectDocument> {
    const createdSubject = new this.subjectModel(createSubjectDto);
    return createdSubject.save();
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }

  async findOne(id: string): Promise<Subject> {
    return this.subjectModel.findById(id).exec();
  }

  async findOneByName(name: string): Promise<SubjectDocument> {
    return this.subjectModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectModel
      .findByIdAndUpdate(id, updateSubjectDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Subject> {
    return this.subjectModel.findByIdAndDelete(id).exec();
  }
}
