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
  const name1 = ;
  console.log(name1);
  if (name1 == "Vladimir") {
    res.status(201);
    res.send({ message: "Great Vladimir" });
  } else {
    res.status(400);
    res.send({ message: "ERROR" });
  }
});

// debug

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
