import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { Users } from '../models/user.model';

@Injectable()
export class AuthService {
  private readonly OTP_TTL = 300; // seconds

  constructor(
    @InjectModel(Users) private userModel: typeof Users,
    private redis: RedisService,
    private jwt: JwtService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(mobile: string) {
    const otp = this.generateOtp();
    await this.redis.set(`otp:${mobile}`, otp, this.OTP_TTL);
    // Return OTP only for demo/testing (replace with SMS in prod)
    return { mobile, otp, ttl: this.OTP_TTL };
  }

  async verifyOtp(mobile: string, otp: string) {
    const key = `otp:${mobile}`;
    const stored = await this.redis.get(key);
    if (!stored || stored !== otp) throw new UnauthorizedException('Invalid or expired OTP');

    let user = await this.userModel.findOne({ where: { phoneNumber: mobile } });
    if (!user) throw new UnauthorizedException('User not found');

    await this.redis.del(key);
    const payload = { id: user.id, mobile: user.phoneNumber };
    const token = await this.jwt.signAsync(payload);
    return { access_token: token };
  }

  async validateUser(userId: number): Promise<Users | null> {
    return this.userModel.findByPk(userId);
  }
}
