import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Categories } from "../@types/categories";
import { FormControl } from "@angular/forms";
import { AppNames } from "../@types/app-names";

@Component({
  selector: "app-appbar",
  templateUrl: "./appbar.component.html",
  styleUrls: ["./appbar.component.scss"]
})
export class AppbarComponent implements OnInit {
  @Input() categories: Categories;
  categoryControl = new FormControl();

  @Output() categoryChosen = new EventEmitter<string>();
  @Output() appNameChosen = new EventEmitter<[string, string]>();

  @Input() appNameList: string[];
  appNameControl = new FormControl();

  constructor() {}

  ngOnInit() {
    this.appNameControl.disable();

    this.categoryControl.valueChanges.subscribe((value: string) => {
      if (!this.categories.includes(value)) {
        this.appNameControl.disable();
        return;
      }

      this.appNameControl.reset();
      this.appNameControl.enable();
      this.categoryChosen.emit(this.categoryControl.value);
    });

    this.appNameControl.valueChanges.subscribe((value: string) => {
      if (!this.appNameList.includes(value)) {
        return;
      }

      this.appNameChosen.emit([
        this.categoryControl.value,
        this.appNameControl.value
      ]);
    });
  }
}
