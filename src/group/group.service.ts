import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from 'src/group/schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import axios from 'axios';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findOne(id: string): Promise<Group> {
    return this.groupModel.findById(id).exec();
  }

  async findOneByNameAndFaculty(
    group: string,
    faculty: string,
  ): Promise<GroupDocument> {
    return this.groupModel
      .findOne({
        name: group,
        faculty: faculty,
      })
      .exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    return this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Group> {
    return this.groupModel.findByIdAndDelete(id).exec();
  }

  async copyAllToDB() {
    const response = await axios.get(
      'https://schedule.kpi.ua/api/schedule/groups',
    );
    const groups = response.data.data;
    // console.log(groups);

    groups.forEach(async (group) => {
      const newGroup = new this.groupModel({
        name: group.name,
        faculty: group.faculty,
        apiId: group.id,
      });
      await newGroup.save();
    });
  }
}
