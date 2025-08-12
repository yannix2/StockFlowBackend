import { Controller,Post, Body, Get, Req, UseGuards,     Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const user = await this.authService.verifyEmailToken(token);
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    return { message: 'Email confirmed successfully' };
  }
   @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }@Post('refresh-token')
async refresh(@Body() body: RefreshTokenDto) {
  return this.authService.refreshToken(body.refreshToken);
}
@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  await this.authService.forgotPassword(dto.email);
  return { message: 'Un e-mail a été envoyé si ce compte existe.' };
}

@Post('reset-password')
async resetPassword(@Body() dto: ResetPasswordDto) {
  await this.authService.resetPassword(dto.token, dto.newPassword);
  return { message: 'Mot de passe mis à jour avec succès.' };
}

@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(@Req() req) {
  const userId = req.user.userId; // Vérifie que req.user est bien défini
  await this.authService.logout(userId);
  return { message: 'Logged out successfully' };
}

}
