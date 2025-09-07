import { Process, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

interface EmailJob {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Processor('email')
export class EmailProcessor {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  @Process('send-email')
  async handleEmailSending(job: Job<EmailJob>) {
    const { to, subject, template, context } = job.data;

    try {
      const html = await this.renderTemplate(template, context);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@showcase-apps.com',
        to,
        subject,
        html,
      });

      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  private async renderTemplate(
    template: string,
    context: Record<string, any>,
  ): Promise<string> {
    // Simple template rendering - in production, use a proper template engine
    let html = '';

    switch (template) {
      case 'welcome':
        html = this.getWelcomeTemplate(context);
        break;
      case 'app-published':
        html = this.getAppPublishedTemplate(context);
        break;
      case 'password-reset':
        html = this.getPasswordResetTemplate(context);
        break;
      default:
        html = this.getDefaultTemplate(context);
    }

    return html;
  }

  private getWelcomeTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Showcase Apps</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Welcome to Showcase Apps!</h1>
            <p>Hi ${context.name},</p>
            <p>Welcome to Showcase Apps! We're excited to have you on board.</p>
            <p>You can now start showcasing your amazing applications to the world.</p>
            <a href="${context.loginUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
            <p>Best regards,<br>The Showcase Apps Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getAppPublishedTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your App Has Been Published</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981;">🎉 Your App is Live!</h1>
            <p>Hi ${context.name},</p>
            <p>Great news! Your app "${context.appTitle}" has been successfully published and is now live on Showcase Apps.</p>
            <a href="${context.appUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your App</a>
            <p>Share it with the world and start getting feedback from users!</p>
            <p>Best regards,<br>The Showcase Apps Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Reset Your Password</h1>
            <p>Hi ${context.name},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${context.resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The Showcase Apps Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getDefaultTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Showcase Apps</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3b82f6;">Showcase Apps</h1>
            <p>${context.message || 'Thank you for using Showcase Apps!'}</p>
            <p>Best regards,<br>The Showcase Apps Team</p>
          </div>
        </body>
      </html>
    `;
  }
}
