import { Body, Controller, Get, Post, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('request-otp')
  @HttpCode(200)
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() dto: RequestOtpDto) {
    return await this.auth.requestOtp(dto.mobile);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return await this.auth.verifyOtp(dto.mobile, dto.otp);
  }

  @ApiBearerAuth('access-token')
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: any) {
    return await req.user;
  }
}
