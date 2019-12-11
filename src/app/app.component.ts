import { Component, OnInit } from "@angular/core";
import { DatasetService } from "./services/dataset.service";
import { Categories } from "./@types/categories";
import { AppNames } from "./@types/app-names";
import isEmpty from "lodash/fp/isEmpty";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  categories: Categories = [];

  appNames: AppNames = {};
  appNameList: string[] = [];

  constructor(private datasetService: DatasetService) {}

  ngOnInit() {
    this.datasetService.getCategories().subscribe(categories => {
      this.categories = categories.map(category => category.replace(/_/g, " "));
    });
  }

  categoryChosen(category: string) {
    this.datasetService
      .getAppNames(category)
      .subscribe((appNames: AppNames) => {
        if (isEmpty(appNames)) return;

        this.appNames = appNames;
        this.appNameList = Object.keys(appNames).map(name =>
          name.replace(/_/g, " ")
        );
      });
  }

  appNameChosen([category, appName]: [string, string]) {
    console.log(category, appName);
  }
}
