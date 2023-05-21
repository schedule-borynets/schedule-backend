import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from 'src/comment/schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    createCommentDto.creationTime = new Date();
    const createdComment = new this.commentModel(createCommentDto);

    return createdComment.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  async findOneByProperty(property: keyof CreateCommentDto, value: any) {
    return this.commentModel.findOne({ [property]: value }).exec();
  }

  async findAllByProperty(property: keyof CreateCommentDto, value: any) {
    return this.commentModel.find({ [property]: value }).exec();
  }
  async findAllBySubjectScheduleAndUser(
    subjectScheduleId: string,
    userId: string,
  ) {
    return this.commentModel
      .find({ subjectSchedule: subjectScheduleId, user: userId })
      .exec();
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async addCommentToSubjectSchedule(
    commentId: string,
    subjectScheduleId: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const subjectSchedule = new Types.ObjectId(subjectScheduleId);

    if (comment.subjectSchedule !== subjectSchedule) {
      comment.subjectSchedule = subjectSchedule;
      await comment.save();
    }
    return comment;
  }

  async findAllByPriorityAscending(): Promise<Comment[]> {
    return this.commentModel.find().sort({ priority: 1 }).exec();
  }
}
