/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
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
//записать два инпута по одному записывать данные в массив, а по другому получать данные
const app = express();
const items = [];


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

app.post('/hello', (req: Request<{}, {}, {name: string}>, res: Response<{message: string}>) => {
  const name1 = req.body.name;
  console.log(name1);
  if (name1?.length > 0) {
    res.status(200);
    res.send({ message: `Greating ${name1}`});
  } else {
    res.status(400);
    res.send({ message: "ERROR" });
  }
});

app.post('/new',(req, res) =>{
  console.log(req.body.data);
  const movie = {id: new Date().getTime(), ...req.body.data};
  items.push(req.body.data);
  res.send({data: {status: "OK", data: movie}});

});

app.get('/er',(req, res) =>{
  console.log(req.body.data);
});
// console.log(req.body.name)

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
