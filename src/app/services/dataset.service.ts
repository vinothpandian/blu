import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, BehaviorSubject } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Categories } from "../@types/categories";
import { AppNames } from "../@types/app-names";
import { Annotations } from "../@types/annotation";
import { displayCase, dirCase } from "../utils/text-case";
import { getPath } from "../utils/paths";

@Injectable({
  providedIn: "root"
})
export class DatasetService {
  private _categories: Categories = [];
  private _categoryList: BehaviorSubject<Categories> = new BehaviorSubject([]);
  get categoryList(): Observable<string[]> {
    return this._categoryList.asObservable();
  }

  private _appNames: AppNames = {};
  private _appNameList: BehaviorSubject<string[]> = new BehaviorSubject([]);
  get appNameList(): Observable<string[]> {
    return this._appNameList.asObservable();
  }

  private _currentFilenameList: number[] = [];
  private _filenames: BehaviorSubject<number[]> = new BehaviorSubject([]);
  get filenames(): Observable<number[]> {
    return this._filenames.asObservable();
  }

  private _imageNames: BehaviorSubject<string[]> = new BehaviorSubject([]);
  get imageNames(): Observable<string[]> {
    return this._imageNames.asObservable();
  }

  private _currentCategory = "";
  private _category: BehaviorSubject<string> = new BehaviorSubject("");
  get category(): Observable<string> {
    return this._category.asObservable();
  }

  private _currentAppName = "";
  private _appName: BehaviorSubject<string> = new BehaviorSubject("");
  get appName(): Observable<string> {
    return this._appName.asObservable();
  }

  private _currentFilename = -1;
  private _filename: BehaviorSubject<number> = new BehaviorSubject(-1);
  get filename(): Observable<number> {
    return this._filename.asObservable();
  }

  constructor(private http: HttpClient) {
    this.getCategories().subscribe(categories => {
      this._categories = categories.map(category => displayCase(category));
      this._categoryList.next(this._categories);
    });
  }

  getCategories(): Observable<Categories> {
    return this.http
      .get<Categories>(`${environment.apiUrl}/categories`)
      .pipe(catchError(this.handleError<Categories>("getCategories", [])));
  }

  setCategory(category: string) {
    if (!this._categories.includes(category)) return;

    this._currentCategory = category;
    this._category.next(this._currentCategory);

    const dirCategory = dirCase(this._currentCategory);
    this.getAppNames(dirCategory).subscribe(appNames => {
      this._appNames = appNames;
      const appNameList = Object.keys(this._appNames).map(appName =>
        displayCase(appName)
      );

      this._appNameList.next(appNameList);
    });
  }

  setAppName(appName: string) {
    this._currentAppName = appName;
    this._appName.next(this._currentAppName);

    const dirAppName = dirCase(this._currentAppName);

    this._currentFilenameList = this._appNames[dirAppName];
    this._filenames.next(this._currentFilenameList);

    const imageNames = this._currentFilenameList.map(filename => {
      return getPath(this._currentCategory, this._currentAppName, filename);
    });

    this._imageNames.next(imageNames);
  }

  setFilename(filename: number) {
    this._currentFilename = filename;
    this._filename.next(this._currentFilename);
  }

  getAppNames(category: string): Observable<AppNames> {
    const _category = category.replace(/\s/g, "_");
    return this.http
      .get<AppNames>(`${environment.apiUrl}/app-names/${_category}`)
      .pipe(catchError(this.handleError<AppNames>("getAppNames", {})));
  }

  getAnnotations(
    category: string,
    appName: string,
    filename: number
  ): Observable<Annotations> {
    const _category = category.replace(/\s/g, "_");
    const _appName = appName.replace(/\s/g, "_");

    return this.http
      .get<Annotations>(
        `${environment.apiUrl}/get-annotation/${_category}/${_appName}/${filename}`
      )
      .pipe(catchError(this.handleError<Annotations>("getAnnotations")));
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
