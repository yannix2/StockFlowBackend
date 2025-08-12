// src/mail/dto/contact-mail.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactMailDto {
  @IsEmail()
  to: string;

  @IsEmail()
  from: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEmail()
  replyTo: string;
}
