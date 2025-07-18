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
import multer from "multer";
const upload = multer();

/******************************************************************************
                                Setup
******************************************************************************/
//записать два инпута по одному записывать данные в массив, а по другому получать данные
const app = express();

import {
  ActorModel,
  GenreModel,
  Movie,
  MovieModel,
} from "./common/types/movie";
import { title } from "process";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan("dev"));
}

if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

//Отображение фильмов
app.get("/", (req: Request<{}, {}, { name: string }>, res: Response<{}>) => {
  MovieModel.findAll({ include: [ActorModel, GenreModel] }).then((movies) => {
    console.log(movies);
    res.render("list", { title: "Movie Catalog: NYX", items: movies });
  });
});

//Удаление фильма
app.delete("/api/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  MovieModel.findByPk(id).then((movie) => {
    movie?.destroy();
    res.send({ success: true });
  });
});

//Редактирование (незаконченно)
app.patch(
  "/api/create/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    MovieModel.findByPk(id).then((movie) => {
      [];
    });
  }
);

//Страница для фильма взятого по id
app.get("/movie/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);
  const movie = await MovieModel.findByPk(id, {
    include: [ActorModel, GenreModel],
  });
  res.render("item", { title: "Фильм", item: movie });
});

// API: получить фильм по ID
app.get(
  "/api/movie/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const movie = await MovieModel.findByPk(id, {
      include: [ActorModel, GenreModel],
    });
    res.send(movie);
  }
);

//Добавить фильм
app.post("/api/add", (req: Request<{}, {}, {}>, res: Response<{}>) => {
  const movie = MovieModel.create(
    {
      title: "last game",
      year: 1950,
      genres: [{ name: "War" }, { name: "History" }],
      actors: [
        { name: "Hellen", lastName: "Heller" },
        { name: "Kris", lastName: "Heller" },
      ],
    },
    {
      include: [ActorModel, GenreModel],
    }
  );
  res.send(movie);
});

//Добавить фильм
app.post(
  "/api/edit",
  upload.none(),
  (req: Request<{}, {}, Movie>, res: Response<{}>) => {
    MovieModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    }).then((updated) => {
      res.send(updated);
    });
  }
);

/******************************************************************************
                                Export default
******************************************************************************/

export { app };
