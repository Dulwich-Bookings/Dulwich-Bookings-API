import {Request, Response, NextFunction} from 'express';
import {parseFile} from 'fast-csv';
import fs from 'fs';

import userFriendlyMessages from '../consts/userFriendlyMessages';
import {BulkSignUpAttributes, Role} from '../models/User';

const parseCsv = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file?.path) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.fileNotFound});
      return;
    }
    const filePath = req.file?.path as string;
    const bulkSignUpAttributes: BulkSignUpAttributes[] = [];
    parseFile(filePath)
      .on('data', (data: string[]) => {
        const email = data[0];
        const role = data[1];
        const gradClass = data[2] ? (data[2] as unknown as number) : undefined;
        bulkSignUpAttributes.push({
          email: email,
          role: role as Role,
          class: gradClass,
        });
      })
      .on('end', () => {
        req.bulkSignUpAttributes = bulkSignUpAttributes;
        fs.unlinkSync(filePath);
        next();
      });
  } catch (e) {
    res.status(400);
    res.json({message: userFriendlyMessages.failure.parseCsv});
    return;
  }
};

export default parseCsv;
