import { environment } from "../../environments/environment";

export const getPath = (category: string, appName: string, filename: number) =>
  `${environment.datasetUrl}/${category}/${appName}/${filename}.jpg`;
