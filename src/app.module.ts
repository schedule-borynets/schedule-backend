import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { CommentModule } from './comment/comment.module';
import { TagModule } from './tag/tag.module';
import { TeacherModule } from './teacher/teacher.module';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { SubjectScheduleModule } from './subject-schedule/subject-schedule.module';
import { LinkModule } from './link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env', '.env.development'] }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    SubjectModule,
    CommentModule,
    TagModule,
    TeacherModule,
    GroupModule,
    AuthModule,
    RefreshTokenModule,
    SubjectScheduleModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
