export class CreateTagDto {
  user: string;

  text: string;

  color?: string | null;

  subjectSchedules?: string[];
}
