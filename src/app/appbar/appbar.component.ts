import { Component, OnInit } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import { Categories } from "../@types/categories";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { AppNames } from "../@types/app-names";
import isEmpty from "lodash/fp/isEmpty";

@Component({
  selector: "app-appbar",
  templateUrl: "./appbar.component.html",
  styleUrls: ["./appbar.component.scss"]
})
export class AppbarComponent implements OnInit {
  categories: Categories = [];
  categoryControl = new FormControl();

  appNames: AppNames = {};
  appNameList: string[] = [];
  appNameControl = new FormControl();

  constructor(private datasetService: DatasetService) {}

  ngOnInit() {
    this.datasetService.getCategories().subscribe(categories => {
      this.categories = categories.map(category => category.replace(/_/g, " "));
      this.categoryControl.setValue(this.categories[0]);
    });

    this.appNameControl.disable();

    this.categoryControl.valueChanges.subscribe((value: string) => {
      if (!this.categories.includes(value)) {
        this.appNameControl.disable();
        return;
      }

      this.datasetService
        .getAppNames(this.categoryControl.value)
        .subscribe((appNames: AppNames) => {
          if (isEmpty(appNames)) return;

          this.appNameControl.enable();

          this.appNames = appNames;
          this.appNameList = Object.keys(appNames).map(name =>
            name.replace(/_/g, " ")
          );
          this.appNameControl.setValue(this.appNameList[0]);
        });
    });
  }
}
