import { Component, OnInit } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import { Annotations } from "../@types/annotation";

type BackgroundStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
};

@Component({
  selector: "app-screens",
  templateUrl: "./screens.component.html",
  styleUrls: ["./screens.component.scss"]
})
export class ScreensComponent implements OnInit {
  category: string;
  appName: string;
  filename: number;

  imagePath: string = "";
  annotation: Annotations;

  backgroundStyle: BackgroundStyle = {
    backgroundColor: "#ddd"
  };

  constructor(private datasetService: DatasetService) {
    this.datasetService.category.subscribe(category => {
      this.category = category;
    });

    this.datasetService.appName.subscribe(appName => {
      this.appName = appName;
    });

    this.datasetService.filename.subscribe(filename => {
      this.filename = filename;
    });

    this.datasetService.imagePath.subscribe(imagePath => {
      this.imagePath = imagePath;
      this.backgroundStyle = {
        backgroundImage: `url(${imagePath})`
      };
    });

    this.datasetService.annotation.subscribe(annotation => {
      this.annotation = annotation;
    });
  }

  ngOnInit() {}
}
