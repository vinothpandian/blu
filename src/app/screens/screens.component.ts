import { Component, OnInit } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import { Annotations, Annotation } from "../@types/annotation";

import isEmpty from "lodash/fp/isEmpty";

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
  getKeys = Object.keys;

  category: string;
  appName: string;
  filename: number;

  imagePath: string = "";
  annotation: Annotations;

  width = 100;
  height = 100;

  viewBox = "";

  boxes = {};

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
    });

    this.datasetService.annotation.subscribe((annotation: Annotations) => {
      this.annotation = annotation;

      if (isEmpty(annotation)) return;

      const { image_size, ...rest } = annotation;
      const [width, height] = image_size;
      this.width = width;
      this.height = height;
      this.viewBox = `0 0 ${width} ${height}`;

      const [svgWidth, svgHeight] = [360, 640];

      const widthRatio = svgWidth / width;
      const heightRatio = svgHeight / height;

      this.boxes = Object.entries(rest).reduce(
        (prev, [key, annotations]: [string, Annotation[]]) => {
          const boundsList = annotations.map(annotation => {
            const { bounds } = annotation;
            const { start, end } = bounds;

            let [x, y] = start;
            let [x1, y1] = end;

            return {
              x,
              y,
              width: x1 - x,
              height: y1 - y
            };
          });

          return { ...prev, [key]: boundsList };
        },
        {}
      );

      console.log(this.boxes);
    });
  }

  ngOnInit() {}
}
