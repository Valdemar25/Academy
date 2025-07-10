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

import { ActorModel, GenreModel, MovieModel } from "./common/types/movie";
import { title } from "process";

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

app.get("/", (req: Request<{}, {}, { name: string }>, res: Response<{}>) => {
  MovieModel.findAll({ include: [ActorModel, GenreModel] }).then((movies) => {
    console.log(movies);
    res.render("list", { title: "hui", items: movies });
  });
});

app.get(
  "/movie/:id",
  (req: Request<{ id: number }, {}, {}>, res: Response<{}>) => {
    res.render("item", { title: "movie", id: req.params.id });
  }
);

app.post("/api/add", (req: Request<{}, {}, {}>, res: Response<{}>) => {
  const movie = MovieModel.create(
    {
      title: "title",
      year: 2000,
      genres: [{ name: "Ужас" }, { name: "Фантастика" }],
      actors: [
        { name: "Никита", lastName: "Кологривый" },
        { name: "Стивен", lastName: "Сигал" },
      ],
    },
    {
      include: [ActorModel, GenreModel],
    }
  );
  res.send(movie);
});

// console.log(req.body.name)
// вынести типы в отдельный файл и оттуда сделать экспорт
/******************************************************************************
                                Export default
******************************************************************************/

export { app };

// onclick="document.location='page/new.html'"
