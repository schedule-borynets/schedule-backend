import { ScheduleType } from 'src/user/schedule-type';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
  readonly scheduleType?: ScheduleType | null;
  readonly group?: string | null;
  readonly teacher?: string | null;
  readonly googleId?: string | null;
  readonly hiddenSubjects?: string[];
}
