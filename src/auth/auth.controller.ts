// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const registeredUser = await this.authService.register(createUserDto);

      return res.json(registeredUser);
    } catch (e) {
      console.log(
        `Error register user with email ${createUserDto.email} - ${e.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() user: LoginAuthDto, @Res() res: Response) {
    try {
      const userData = await this.authService.login(user);

      return res.json(userData);
    } catch (e) {
      console.error(`Error login user with email ${user.email} - ${e.message}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('refresh')
  async refresh(@Body('refresh_token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  async logout(@Body('refresh_token') token: string) {
    return this.authService.logout(token);
  }
}
