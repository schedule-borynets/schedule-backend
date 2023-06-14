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
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request, @Body() createLinkDto: CreateLinkDto) {
    createLinkDto.user = request.user.id;
    return this.linkService.create(createLinkDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request) {
    return this.linkService.findAllByProperty('user', request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkService.findOne(id);
  }

  @Get('/subject-schedule/:subjectScheduleId')
  @UseGuards(JwtAuthGuard)
  async findOneByScheduleSubject(
    @Req() request,
    @Param('subjectScheduleId') subjectScheduleId: string,
  ) {
    return this.linkService.findAllBySubjectScheduleAndUser(
      subjectScheduleId,
      request.user.id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linkService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.linkService.remove(id);
  }

  @Patch('add-link-to-subject/:subject-schedule-id')
  async addLinkToSubject(
    @Param('subject-schedule-id') subjectId: string,
    @Body() createLinkDto: CreateLinkDto,
  ) {
    const link = await this.linkService.create(createLinkDto);
    return this.linkService.addLinkToSubjectSchedule(link.id, subjectId);
  }
}
