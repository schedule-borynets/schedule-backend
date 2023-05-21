import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
} from '@nestjs/common';
import { SubjectScheduleService } from './subject-schedule.service';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';

@Controller('subject-schedule')
export class SubjectScheduleController {
  constructor(
    private readonly subjectScheduleService: SubjectScheduleService,
  ) {}

  @Post()
  create(@Body() createSubjectScheduleDto: CreateSubjectScheduleDto) {
    return this.subjectScheduleService.create(createSubjectScheduleDto);
  }

  @Get()
  // @Header('Cache-Control', 'public, max-age=3600')
  findAll() {
    return this.subjectScheduleService.findAll();
  }
  @Get('copy-all-to-db')
  copyAllToDB() {
    return this.subjectScheduleService.copyAllToDB();
  }
  @Get(':id')
  // @Header('Cache-Control', 'public, max-age=3600')
  findOne(@Param('id') id: string) {
    return this.subjectScheduleService.findOne(id);
  }

  @Get('/group/:id')
  // @Header('Cache-Control', 'public, max-age=3600')
  findAllByGroup(@Param('id') id: string) {
    return this.subjectScheduleService.findAllByGroup(id);
  }

  @Get('/teacher/:id')
  // @Header('Cache-Control', 'public, max-age=3600')
  findAllByTeacher(@Param('id') id: string) {
    return this.subjectScheduleService.findAllByTeacher(id);
  }

  @Patch(':id')
  // @Header('Cache-Control', 'public, max-age=3600')
  update(
    @Param('id') id: string,
    @Body() updateSubjectScheduleDto: UpdateSubjectScheduleDto,
  ) {
    return this.subjectScheduleService.update(id, updateSubjectScheduleDto);
  }

  @Delete(':id')
  @Header('Cache-Control', 'public, max-age=3600')
  remove(@Param('id') id: string) {
    return this.subjectScheduleService.remove(id);
  }
}
