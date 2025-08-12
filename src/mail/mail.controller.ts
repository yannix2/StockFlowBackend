// src/mail/mail.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ContactMailDto } from './dto/contact-mail.dto';

@Controller('/mail') 
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact')
  async handleContactForm(@Body() body: ContactMailDto) {
    const { to, from, subject, text, replyTo } = body;

    await this.mailService.sendMailcontact(
      to,
      subject,
      text.replace(/\n/g, '<br>'),
      replyTo,
    );

    return { message: 'Email sent successfully' };
  }
}
