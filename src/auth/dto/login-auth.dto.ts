import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class LoginAuthDto extends PickType(UserDto, [
  'email',
  'password',
  'googleId',
  'id',
] as const) {}
