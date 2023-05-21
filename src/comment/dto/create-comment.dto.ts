export class CreateCommentDto {
  user: string;

  subjectSchedule: string;

  creationTime: Date;

  endTime?: Date | null;

  priority?: number | null;

  text: string;
}
