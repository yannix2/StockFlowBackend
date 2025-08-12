import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly MAILJET_URL = 'https://api.mailjet.com/v3.1/send';

  constructor(private readonly configService: ConfigService) {}

  async sendMail(to: string, subject: string, html: string) {
    const apiKey = this.configService.get('MAILJET_API_KEY');
    const apiSecret = this.configService.get('MAILJET_API_SECRET');
    const fromEmail = this.configService.get('MAILJET_FROM_EMAIL');

    try {
      await axios.post(
        this.MAILJET_URL,
        {
          Messages: [
            {
              From: {
                Email: fromEmail.split('<')[1].replace('>', '').trim(),
                Name: fromEmail.split('<')[0].trim(),
              },
              To: [{ Email: to }],
              Subject: subject,
              HTMLPart: html,
            },
          ],
        },
        {
          auth: {
            username: apiKey,
            password: apiSecret,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Mailjet error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
async sendMailcontact(to: string, subject: string, html: string, replyTo?: string) {
  const apiKey = this.configService.get('MAILJET_API_KEY');
  const apiSecret = this.configService.get('MAILJET_API_SECRET');
  const fromEmail = this.configService.get('MAILJET_FROM_EMAIL');

  try {
    await axios.post(
      this.MAILJET_URL,
      {
        Messages: [
          {
            From: {
              Email: fromEmail.split('<')[1].replace('>', '').trim(),
              Name: fromEmail.split('<')[0].trim(),
            },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html.replace(/\n/g, '<br>'),
            ...(replyTo && { ReplyTo: { Email: replyTo } }),
          },
        ],
      },
      {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Mailjet error:', error.response?.data || error.message);
    throw new InternalServerErrorException('Failed to send email');
  }
}
  async sendValidationEmail(to: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/confirm-email?token=${token}`;
    const html = `
      <h3>Bienvenue sur Stockflow !</h3>
      <p>Veuillez confirmer votre adresse e-mail en cliquant sur le lien suivant :</p>
      <a href="${url}">${url}</a>
    `;

    await this.sendMail(to, 'Confirmez votre adresse e-mail', html);
  }
  async sendResetPasswordEmail(to: string, token: string) {
  const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
  const html = `
    <h3>Réinitialisation du mot de passe - Stockflow</h3>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur ce lien pour en créer un nouveau (valide 30 minutes) :</p>
    <a href="${url}">${url}</a>
    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
  `;

  await this.sendMail(to, 'Réinitialisation du mot de passe', html);
}
async sendPasswordResetConfirmationEmail(to: string) {
  const html = `
    <h3>Votre mot de passe a été modifié</h3>
    <p>Bonjour,</p>
    <p>Votre mot de passe a été réinitialisé avec succès. Si ce n'était pas vous, veuillez contacter l'administrateur immédiatement.</p>
    <p>Merci,</p>
    <p>L’équipe Stockflow</p>
  `;

  await this.sendMail(to, 'Confirmation de réinitialisation du mot de passe', html);
}
}