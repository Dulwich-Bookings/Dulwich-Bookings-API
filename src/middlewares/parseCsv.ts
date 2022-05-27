import {Request, Response, NextFunction} from 'express';
import csv from 'fast-csv';
import fs from 'fs';

import userFriendlyMessages from '../consts/userFriendlyMessages';

const parseCsv = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file?.path) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.fileNotFound});
      return;
    }
    const filePath = req.file?.path as string;
    const fileRows: string[][] = [];
    csv
      .parseFile(filePath)
      .on('data', (data: string[]) => {
        fileRows.push(data);
      })
      .on('end', () => {
        req.body.userAttributes = fileRows;
        fs.unlinkSync(filePath);
      });
    next();
  } catch (e) {
    res.status(400);
    res.json({message: userFriendlyMessages.failure.parseCsv});
    return;
  }
};

export default parseCsv;
