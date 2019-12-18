import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Categories } from "../@types/categories";
import { FormControl } from "@angular/forms";
import { AppNames } from "../@types/app-names";
import { DatasetService } from "../services/dataset.service";

@Component({
  selector: "app-appbar",
  templateUrl: "./appbar.component.html",
  styleUrls: ["./appbar.component.scss"]
})
export class AppbarComponent implements OnInit {
  categories: Categories = [];
  categoryControl = new FormControl();

  appNameList: string[] = [];
  appNameControl = new FormControl();

  constructor(private datasetService: DatasetService) {
    this.datasetService.categoryList.subscribe(categories => {
      this.categories = categories.sort();

      if (this.categories.includes("Demo")) {
        this.categoryControl.setValue("Demo");
        return;
      }

      this.categoryControl.setValue(this.categories[0]);
    });

    this.datasetService.appNameList.subscribe(appNameList => {
      this.appNameList = appNameList.sort();
      this.appNameControl.setValue(this.appNameList[0]);
    });
  }

  ngOnInit() {
    this.appNameControl.disable();

    this.categoryControl.valueChanges.subscribe((value: string) => {
      if (!this.categories.includes(value)) {
        this.appNameControl.disable();
        return;
      }

      this.appNameControl.reset();
      this.appNameControl.enable();
      this.datasetService.setCategory(this.categoryControl.value);
    });

    this.appNameControl.valueChanges.subscribe((value: string) => {
      if (!this.appNameList.includes(value)) {
        return;
      }

      this.datasetService.setAppName(this.appNameControl.value);
    });
  }
}
