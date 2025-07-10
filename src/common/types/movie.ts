import { sequelize } from "@src/db/dbconn";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,

} from "sequelize";

interface Movie extends Model<
    InferAttributes<MovieModel>,
    InferCreationAttributes<MovieModel>
  > {
  id?: CreationOptional<number>;
  title: string;
  year: number;
}


const GenreModel = sequelize.define(
  'genre',
  {
    name: DataTypes.STRING,
  },
  { timestamps: false },
);

const ActorModel = sequelize.define(
  'actor',
  {
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
  },
  { timestamps: false },
);

const MovieModel = sequelize.define<Movie>("movie", {
  title: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.INTEGER.UNSIGNED,

  },
});

GenreModel.belongsTo(MovieModel);
ActorModel.belongsTo(MovieModel);
MovieModel.hasMany(GenreModel);
MovieModel.hasMany(ActorModel);

sequelize.sync()
export { MovieModel, ActorModel, GenreModel };

