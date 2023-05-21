import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Tag, TagDocument } from 'src/tag/schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async findAllByProperty(property: keyof CreateTagDto, value: any) {
    return this.tagModel.find({ [property]: value }).exec();
  }

  async findAllBySubjectScheduleAndUser(
    subjectScheduleId: string,
    userId: string,
  ) {
    return this.tagModel
      .find({ subjectSchedules: { $in: [subjectScheduleId] }, user: userId })
      .exec();
  }

  async findOne(id: string): Promise<Tag> {
    return this.tagModel.findById(id).exec();
  }

  async update(id: string, UpdateTagDto: UpdateTagDto): Promise<Tag> {
    return this.tagModel
      .findByIdAndUpdate(id, UpdateTagDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Tag> {
    return this.tagModel.findByIdAndDelete(id).exec();
  }

  async addSubjectToTag(tagId: string, subjectId: string): Promise<Tag> {
    const tag = await this.tagModel.findById(tagId);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    const subject = new Types.ObjectId(subjectId);

    if (!tag.subjectSchedules.includes(subject)) {
      tag.subjectSchedules.push(subject);
      await tag.save();
    }
    return tag;
  }

  async removeSubjectFromTag(tagId: string, subjectId: string): Promise<Tag> {
    const tag = await this.tagModel.findById(tagId);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const subject = new Types.ObjectId(subjectId);

    const subjectIndex = tag.subjectSchedules.indexOf(subject);
    if (subjectIndex > -1) {
      tag.subjectSchedules.splice(subjectIndex, 1);
      await tag.save();
    }
    return tag;
  }
}
