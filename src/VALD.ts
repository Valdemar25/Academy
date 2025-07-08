export interface Movie {
  id?: number;
  title: string;
  genres: string[];
  actors: string[];
  year: number;
}

export interface MovieFilter {
  year: number;
  actor:string;
  genre: string;
  title: string;
}