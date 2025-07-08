/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import ENV from "@src/common/constants/env";
import { NodeEnvs } from "@src/common/constants";

/******************************************************************************
                                Setup
******************************************************************************/
//записать два инпута по одному записывать данные в массив, а по другому получать данные
const app = express();

import { Movie, MovieFilter } from "./common/types/movie";
import { User } from "./db/movie";
import { UserModel } from "./common/types/user";

const items: Movie[] = [
  {
    title: "Fight",
    genres: ["war", "documental"],
    actors: ["Pupa", "Lupa", "Chook"],
    year: 1995,
  },
  {
    title: "Fight",
    genres: ["war", "documental"],
    actors: ["Pupa", "Lupa", "Geck"],
    year: 1996,
  },
];

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan("dev"));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.get(
  "/hello",
   (
    req: Request<{}, {}, { name: string }>,
    res: Response<{ message: string }>
  ) => {
    const jane = UserModel.build({ name: "Jane" });
    console.log(jane instanceof UserModel); // true
    console.log(jane.name); // "Jane"
    jane.save().then((saved) => console.log(saved));
  }
);

app.post("/new", (req, res) => {
  console.log(req.body.data);
  const movie: Movie = { id: new Date().getTime(), ...req.body.data };
  items.push(movie);
  res.send({ data: { status: "OK", data: movie } });
});

/*function keep(array, chast){
  const filtered = items.filter((array) =>{
    let match = true;
    if (chast) {
      match = match && array.actors.includes(chast);
    }
    return match;
  });
  return filtered;
}*/

app.get(
  "/movies",
  (
    request: Request<{}, {}, MovieFilter>,
    response: Response<{ data: typeof items }>
  ) => {
    console.log(items);
    const filtered = items.filter((item) => {
      let match = true;
      if (request?.body?.year) {
        match = match && request?.body?.year === item.year;
      }
      if (request?.body?.actor) {
        match = match && item.actors.includes(request?.body?.actor);
      }
      if (request?.body?.genre) {
        match = match && item.genres.includes(request?.body?.genre);
      }
      if (request?.body?.title) {
        match = match && item.title.includes(request?.body?.title);
        //match = match && (request?.body?.title === item.title);
      }
      return match;
    });
    response.send({ data: filtered });
  }
);
// console.log(req.body.name)
// вынести типы в отдельный файл и оттуда сделать экспорт
/******************************************************************************
                                Export default
******************************************************************************/

export { app };
