import { PickType } from '@nestjs/mapped-types';
import { UserDto } from 'src/user/dto/user.dto';

export class LoginAuthDto extends PickType(UserDto, [
  'email',
  'password',
  'id',
] as const) {}
