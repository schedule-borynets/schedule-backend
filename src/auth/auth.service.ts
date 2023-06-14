import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from './jwt-payload.interface';
import { jwtConstants } from 'src/auth/constants';
import { UserDto } from 'src/user/dto/user.dto';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const candidate = await this.userService.findOneByProperty(
      'email',
      createUserDto.email,
    );
    if (candidate) {
      throw new Error(`User with email ${createUserDto.email} already exists`);
    }
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userService.create({
      ...createUserDto,
      password: passwordHash,
    });
    const tokens = this.generateTokens(newUser._id.toString(), newUser.email);
    await this.saveToken(newUser._id.toString(), tokens.refresh_token);
    return {
      ...tokens,
      user: new UserDto(newUser),
    };
  }

  generateTokens(userId: string, email: string) {
    const payload: UserJwtPayload = { email: email, sub: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.accessExpiration,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secretRefresh,
      expiresIn: jwtConstants.refreshExpiration,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    return await this.refreshTokenService.saveToken(userId, refreshToken);
  }

  async refreshToken(token: string) {
    const refreshToken = await this.refreshTokenService.findRefreshToken(token);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const userData = this.validateToken(token, jwtConstants.secretRefresh);
    const candidate = await this.userService.findOneById(userData.userId);
    const tokens = this.generateTokens(
      candidate._id.toString(),
      candidate.email,
    );
    await this.saveToken(candidate._id.toString(), tokens.refresh_token);
    return {
      ...tokens,
      user: new UserDto(candidate),
    };
  }

  async logout(token: string) {
    return this.refreshTokenService.deleteRefreshToken(token);
  }

  validateToken(token: string, secret: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret,
      });
      return userData;
    } catch (error) {
      return null;
    }
  }

  async login(user: LoginAuthDto) {
    const candidate = await this.userService.findOneByProperty(
      'email',
      user.email,
    );
    if (!candidate) {
      throw new Error(`User with email ${user.email} does not exist`);
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      candidate.password,
    );
    if (!isPasswordValid) {
      throw new Error(`Invalid password`);
    }
    const tokens = this.generateTokens(
      candidate._id.toString(),
      candidate.email,
    );
    await this.saveToken(candidate._id.toString(), tokens.refresh_token);
    return {
      ...tokens,
      user: new UserDto(candidate),
    };
  }
}
