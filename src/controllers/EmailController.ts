import {NextFunction, Request, Response} from 'express';
import userFriendlyMessage from '../consts/userFriendlyMessages';
import EmailService from '../services/EmailService';

export default class EmailController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  public async sendMail(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = req.body;
      await this.emailService.sendOneEmail(msg);
      res.json({message: userFriendlyMessage.success.sendEmail});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessage.failure.sendEmail});
      next(e);
    }
  }
}
