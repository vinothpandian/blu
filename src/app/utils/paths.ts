import { environment } from "../../environments/environment";
import { dirCase } from "./text-case";

export const getPath = (category: string, appName: string, filename: number) =>
  `${environment.datasetUrl}/${dirCase(category)}/${dirCase(
    appName
  )}/${filename}.jpg`;
