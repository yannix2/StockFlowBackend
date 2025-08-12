import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common'; 
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service'; // Assuming you have a MailService for sending emails
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService, // Assuming you have a MailService for sending emails
  ) {}

  async verifyEmailToken(token: string): Promise<User | null> {
     console.log('Token reçu:', token);
    const user = await this.userRepo.findOne({ where: { validationParEmailToken: token } });
    console.log('User trouvé:', user);
    if (!user) {
      return null;
    }

    user.isActive = true;
    user.validationParEmailToken = '';
    await this.userRepo.save(user);

    return user;
  }
async login(email: string, password: string): Promise<{
  accessToken: string;
  refreshToken: string;
  name: string;
  familyName: string;
  email: string;
  role: string;
}> {
  const user = await this.userRepo.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedException('User not found or inactive account');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Password is incorrect');
  }
  if(user.isActive==false){
    throw new UnauthorizedException('Account is not active. Please verify your email.');
  }
  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = this.jwtService.sign(payload);
  const refreshToken = this.jwtService.sign(payload, {
    expiresIn: '5h',
  });

  user.refreshToken = refreshToken;
  await this.userRepo.save(user);

  return {
    accessToken,
    refreshToken,
    name: user.name,
    familyName: user.familyName,
    email: user.email,
    role: user.role,
  };
}

async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userRepo.findOne({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    
    const newAccessToken = this.jwtService.sign(
      { userId: user.id, role: user.role },
      { expiresIn: '1h' }
    );

    
    const newRefreshToken = this.jwtService.sign(
      { userId: user.id, role: user.role },
      { expiresIn: '5h' }
    );

    
    user.refreshToken = newRefreshToken;
    await this.userRepo.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new UnauthorizedException('Token expired or invalid');
  }
}
async forgotPassword(email: string): Promise<void> {
  const user = await this.userRepo.findOne({ where: { email } });
  if (!user) return;

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000);

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await this.userRepo.save(user);

  await this.mailService.sendResetPasswordEmail(user.email, token);
}

async resetPassword(token: string, newPassword: string): Promise<void> {
  const user = await this.userRepo.findOne({
    where: { resetPasswordToken: token },
  });

  if (!user ||  !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new BadRequestException('Token invalide ou expiré');
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  user.resetPasswordToken = '';
  user.resetPasswordExpires = null;

  await this.userRepo.save(user);
  await this.mailService.sendPasswordResetConfirmationEmail(user.email);
}
async logout(userId: number): Promise<void> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (user) {
    user.refreshToken = '';  
    await this.userRepo.save(user);
  }
}

}
