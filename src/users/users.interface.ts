import { Sector } from "src/sectores/sectores.interface";

export interface User {
  _id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  sector: Sector;
  puesto?: string;
}