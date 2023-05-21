import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request, @Body() createTagDto: CreateTagDto) {
    createTagDto.user = request.user.id;
    return this.tagService.create(createTagDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request) {
    return this.tagService.findAllByProperty('user', request.user.id);
  }

  @Get('/subject-schedule/:subjectScheduleId')
  @UseGuards(JwtAuthGuard)
  finsAllBySubjectScheduleAndUser(
    @Req() request,
    @Param('subjectScheduleId') subjectScheduleId: string,
  ) {
    return this.tagService.findAllBySubjectScheduleAndUser(
      subjectScheduleId,
      request.user.id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  @Patch(':tagId/add-subject/:subjectId')
  addSubjectToTag(
    @Param('tag-id') tagId: string,
    @Param('subject-id') subjectId: string,
  ) {
    return this.tagService.addSubjectToTag(tagId, subjectId);
  }

  @Patch(':tagId/remove-subject/:subjectId')
  removeSubjectFromTag(
    @Param('tag-id') tagId: string,
    @Param('subject-id') subjectId: string,
  ) {
    return this.tagService.removeSubjectFromTag(tagId, subjectId);
  }
}
