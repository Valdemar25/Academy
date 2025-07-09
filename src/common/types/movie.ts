import { sequelize } from "@src/db/dbconn";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

interface Movie {
  id?: number;
  title: string;
  genres: string[];
  actors: string[];
  year: number;
}

interface MovieFilter {
  year: number;
  actor:string;
  genre: string;
  title: string;
}