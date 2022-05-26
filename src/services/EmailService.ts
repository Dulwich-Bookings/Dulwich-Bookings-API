import SGMail from '@sendgrid/mail';
import environment from '../consts/enviroment';

type emailMessage = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type setPasswordOptions = {
  to: string;
  tempPassword: string;
};

export default class EmailService {
  constructor() {
    SGMail.setApiKey(environment.sendGridAPI);
  }

  public async sendOneEmail(message: emailMessage) {
    await SGMail.send(message);
  }

  public async sendMultipleEmails(emails: emailMessage[]) {
    await SGMail.send(emails);
  }

  public async sendSetPasswordEmail(setPasswordOptions: setPasswordOptions[]) {
    try {
      const messages = setPasswordOptions.map(msg => {
        return {
          from: 'bookingsdulwich@gmail.com',
          to: msg.to,
          subject: 'Dulwich Bookings: Set Your Password',
          html:
            `Welcome,<br><b>Email: </b>'${msg.to}<br><b>Temporary Password: </b>'${msg.tempPassword}<br><br>` +
            'Please Login to Dulwich Bookings and set a new password,<br>' +
            'Kind Regards, <br>Dulwich Bookings',
        };
      });

      await this.sendMultipleEmails(messages);
    } catch (e) {
      console.log(e);
    }
  }

  public async sendResetForgotPasswordEmail(to: string, url: string) {
    try {
      const message = {
        from: 'bookingsdulwich@gmail.com',
        to: to,
        subject: 'Dulwich Bookings: Forgot Your Password',
        html:
          `Welcome, <br>Click on link to reset your forgotten password: <a href=${url}>${url}</a><br><br>` +
          'Kind Regards, <br>Dulwich Bookings',
      };
      await this.sendOneEmail(message);
    } catch (e) {
      console.log(e);
    }
  }

  public async sendConfirmEmail(to: string, url: string) {
    try {
      const message = {
        from: 'bookingsdulwich@gmail.com',
        to: to,
        subject: 'Dulwich Bookings: Confirm your Email',
        html:
          `Welcome, <br>Click on link to confirm your email: <a href=${url}>${url}</a><br><br>` +
          'Kind Regards, <br>Dulwich Bookings',
      };
      await this.sendOneEmail(message);
    } catch (e) {
      console.log(e);
    }
  }
}
