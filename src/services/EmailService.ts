import SGMail from '@sendgrid/mail';
import environment from '../consts/enviroment';
import userFriendlyMessages from '../consts/userFriendlyMessages';

type emailMessage = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type setPasswordOptions = {
  to: string;
  url: string;
};

export class EmailQuotaExceededError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.emailQuotaExceeded);
  }
}

export default class EmailService {
  constructor() {
    SGMail.setApiKey(environment.sendGridAPI);
  }

  public async sendOneEmail(message: emailMessage) {
    try {
      await SGMail.send(message);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Forbidden' || err.message === 'Unauthorized') {
        throw new EmailQuotaExceededError();
      }
      console.log(e);
    }
  }

  public async sendMultipleEmails(emails: emailMessage[]) {
    try {
      await SGMail.send(emails);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Forbidden' || err.message === 'Unauthorized') {
        throw new EmailQuotaExceededError();
      }
      console.log(e);
    }
  }

  public async sendSetPasswordEmail(setPasswordOptions: setPasswordOptions[]) {
    const messages = setPasswordOptions.map(msg => {
      return {
        from: 'bookingsdulwich@gmail.com',
        to: msg.to,
        subject: 'Dulwich Bookings: Set Your Password',
        html:
          `Welcome, <br>Click on link to set your password: <a href=${msg.url}>${msg.url}</a><br><br>` +
          'Kind Regards, <br>Dulwich Bookings',
      };
    });

    await this.sendMultipleEmails(messages);
  }

  public async sendResetForgotPasswordEmail(to: string, url: string) {
    const message = {
      from: 'bookingsdulwich@gmail.com',
      to: to,
      subject: 'Dulwich Bookings: Forgot Your Password',
      html:
        `Welcome, <br>Click on link to reset your forgotten password: <a href=${url}>${url}</a><br><br>` +
        'Kind Regards, <br>Dulwich Bookings',
    };
    await this.sendOneEmail(message);
  }

  public async sendConfirmEmail(to: string, url: string) {
    const message = {
      from: 'bookingsdulwich@gmail.com',
      to: to,
      subject: 'Dulwich Bookings: Confirm your Email',
      html:
        `Welcome, <br>Click on link to confirm your email: <a href=${url}>${url}</a><br><br>` +
        'Kind Regards, <br>Dulwich Bookings',
    };
    await this.sendOneEmail(message);
  }
}
