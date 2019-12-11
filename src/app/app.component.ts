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

  images = {};

  constructor(private datasetService: DatasetService) {}

  ngOnInit() {
    // this.datasetService.getCategories().subscribe(categories => {
    //   this.categories = categories.map(category => category.replace(/_/g, " "));
    // });

    // Debug
    this.categoryChosen("Social");
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

        // Debug
        this.appNameChosen(["Social", "ASKfm"]);
      });
  }

  appNameChosen([category, appName]: [string, string]) {
    const name = appName.replace(/\s/g, "_");
    const filenames = this.appNames[name];

    this.datasetService
      .getImages(category, appName, filenames)
      .subscribe((image: Blob) => {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.images.push(reader.result);
          },
          false
        );
        if (image) {
          reader.readAsDataURL(image);
        }
      });
  }
}
