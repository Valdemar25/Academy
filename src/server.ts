/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import { NodeEnvs } from '@src/common/constants';


/******************************************************************************
                                Setup
******************************************************************************/

const app = express();


// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.put('/hello', (req, res) => {
  console.log(req.body.name);
  res.status(201);
  res.send({message: "hello"});
});


// задача при правильном формате данных вводе выводить GR VL при неправильном ERROR, hello это адресс, а имя name
// debug

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
