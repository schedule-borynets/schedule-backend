import { Injectable } from '@nestjs/common';
// import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
// import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/refresh-token/schemas/refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async createRefreshToken(userId: string, refreshToken: string) {
    return this.refreshTokenModel.create({
      user: userId,
      refreshToken,
    });
  }
  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.refreshTokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const newToken = await this.refreshTokenModel.create({
      user: userId,
      refreshToken,
    });
    return newToken;
  }

  async findRefreshToken(token: string) {
    return this.refreshTokenModel.findOne({ refreshToken: token }).exec();
  }

  async deleteRefreshToken(token: string) {
    return this.refreshTokenModel.deleteOne({ refreshToken: token }).exec();
  }
}
