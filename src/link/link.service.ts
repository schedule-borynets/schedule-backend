import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Link, LinkDocument } from './schemas/link.schema';

@Injectable()
export class LinkService {
  constructor(@InjectModel(Link.name) private linkModel: Model<LinkDocument>) {}

  async create(createLinkDto: CreateLinkDto): Promise<LinkDocument> {
    const createdLink = new this.linkModel(createLinkDto);
    return createdLink.save();
  }

  async findAll(): Promise<Link[]> {
    return this.linkModel.find().exec();
  }

  async findOne(id: string): Promise<Link> {
    return this.linkModel.findById(id).exec();
  }

  async findOneByProperty(property: keyof CreateLinkDto, value: any) {
    return this.linkModel.findOne({ [property]: value }).exec();
  }

  async findAllByProperty(property: keyof CreateLinkDto, value: any) {
    return this.linkModel.find({ [property]: value }).exec();
  }
  async findAllBySubjectScheduleAndUser(
    subjectScheduleId: string,
    userId: string,
  ) {
    return this.linkModel
      .find({ subjectSchedule: subjectScheduleId, user: userId })
      .exec();
  }

  async update(id: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    return this.linkModel
      .findByIdAndUpdate(id, updateLinkDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Link> {
    return this.linkModel.findByIdAndDelete(id).exec();
  }

  async addLinkToSubjectSchedule(
    linkId: string,
    subjectScheduleId: string,
  ): Promise<Link> {
    const link = await this.linkModel.findById(linkId);
    if (!link) {
      throw new NotFoundException('Comment not found');
    }
    const subjectSchedule = new Types.ObjectId(subjectScheduleId);

    if (link.subjectSchedule !== subjectSchedule) {
      link.subjectSchedule = subjectSchedule;
      await link.save();
    }
    return link;
  }
}
