import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request, @Body() createCommentDto: CreateCommentDto) {
    createCommentDto.user = request.user.id;
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request) {
    return this.commentService.findAllByProperty('user', request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }
  @Get('/subject-schedule/:subjectScheduleId')
  @UseGuards(JwtAuthGuard)
  async findOneByScheduleSubject(
    @Req() request,
    @Param('subjectScheduleId') subjectScheduleId: string,
  ) {
    return this.commentService.findAllBySubjectScheduleAndUser(
      subjectScheduleId,
      request.user.id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @Patch('add-comment-to-subject/:subject-schedule-id')
  async addCommentToSubject(
    @Param('subject-schedule-id') subjectId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.create(createCommentDto);
    return this.commentService.addCommentToSubjectSchedule(
      comment.id,
      subjectId,
    );
  }
}
