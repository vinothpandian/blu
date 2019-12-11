import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
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
  @ViewChild("heroImage", { static: false }) image: ElementRef;

  appNames: AppNames = {};
  appNameList: string[] = [];
  imageSource = null;

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
    this.datasetService.getImage(category, appName, "1").subscribe(image => {
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          this.imageSource = reader.result;
        },
        false
      );
      if (image) {
        reader.readAsDataURL(image);
      }
    });
  }
}
