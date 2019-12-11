import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Categories } from "../@types/categories";
import { AppNames } from "../@types/app-names";

@Injectable({
  providedIn: "root"
})
export class DatasetService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categories> {
    return this.http
      .get<Categories>(`${environment.datasetUrl}/categories`)
      .pipe(catchError(this.handleError<Categories>("getCategories", [])));
  }

  getAppNames(value: string): Observable<AppNames> {
    const category = value.replace(/\s/g, "_");
    return this.http
      .get<AppNames>(`${environment.datasetUrl}/app-names/${category}`)
      .pipe(catchError(this.handleError<AppNames>("getAppNames", {})));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      console.warn(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
