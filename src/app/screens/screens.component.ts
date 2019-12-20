import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import { Annotations } from "../@types/annotation";
import { SVG, Svg, Rect, Text, Line, G } from "@svgdotjs/svg.js";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";

import isEmpty from "lodash/fp/isEmpty";

import * as shortid from "shortid";

interface AnnotationNode {
  name: string;
  children?: AnnotationNode[];
}

type BackgroundStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
};

@Component({
  selector: "app-screens",
  templateUrl: "./screens.component.html",
  styleUrls: ["./screens.component.scss"]
})
export class ScreensComponent implements OnInit, AfterViewInit {
  getKeys = Object.keys;

  category: string;
  appName: string;
  filename: number;

  imagePath: string = "";
  annotations: Annotations;
  svgCanvas: Svg;

  width = 100;
  height = 100;

  displayBg = true;

  viewBox = "0 0 360 640";

  boxes = {};
  TREE_DATA: AnnotationNode[] = [];
  treeControl = new NestedTreeControl<AnnotationNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<AnnotationNode>();

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

    this.datasetService.annotation.subscribe((annotations: Annotations) => {
      this.annotations = annotations;

      if (isEmpty(annotations)) return;

      const { bounds, ...rest } = annotations;
      const [, , width, height] = bounds;
      this.width = width;
      this.height = height;
      this.viewBox = `0 0 ${width} ${height}`;

      this.svgCanvas = SVG(".blueprint-canvas");
      this.svgCanvas.clear();

      this.svgCanvas.rect(this.width, this.height).fill("#0b94ba");

      const group = new G().addClass("root").addTo(this.svgCanvas);

      group.data("bounds", {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,
        width: width,
        height: height,
        component: "root"
      });

      this.parseAnnotations(rest?.children, group);

      const children = this.buildAnnotationTree(annotations?.children, []);

      this.TREE_DATA = [
        {
          name: "root",
          children
        }
      ];

      this.dataSource.data = this.TREE_DATA;
    });
  }

  hasChild = (_: number, node: AnnotationNode) =>
    !!node.children && node.children.length > 0;

  buildAnnotationTree(annotations: Annotations[], []): AnnotationNode[] {
    const children = annotations.reduce(
      (previousValue: AnnotationNode[], currentValue: Annotations) => {
        const name = currentValue?.componentLabel ?? "root";

        let children = [];

        if (Object.keys(currentValue).includes("children")) {
          children = this.buildAnnotationTree(currentValue.children, []);
        }

        if (isEmpty(children)) {
          return [...previousValue, { name }];
        }

        return [
          ...previousValue,
          {
            name,
            children
          }
        ];
      },
      []
    );

    return children;
  }

  parseAnnotations(annotations: Annotations[], parent: G) {
    annotations.forEach((annotations: Annotations, index: number) => {
      const label = annotations?.componentLabel ?? "group";

      const className = `${label}_${index}_${shortid.generate()}`;

      const group = new G().addClass(className);

      const { bounds } = annotations;
      const [x1, y1, x2, y2] = bounds;

      const width = x2 - x1;
      const height = y2 - y1;

      group.data("bounds", {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width: width,
        height: height,
        component: label
      });

      const rect = new Rect()
        .size(width, height)
        .move(x1, y1)
        .fill("transparent")
        .stroke({
          color: "white",
          width: 4
        });

      group.add(rect);
      parent.add(group);

      const [addHighlight, removeHighlight] = this.getHighlightListeners(
        x1,
        y1,
        width,
        height,
        group,
        parent
      );

      rect.on("mouseover", addHighlight);
      rect.on("mouseout", removeHighlight);

      if (Object.keys(annotations).includes("children")) {
        this.parseAnnotations(annotations.children, group);
      }

      return;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  createLines({ x1, y1, x2, y2 }) {
    return new Line({
      x1,
      y1,
      x2,
      y2
    }).stroke({
      color: "white",
      width: 4
    });
  }

  getHighlightListeners(
    x: number,
    y: number,
    width: number,
    height: number,
    element: any,
    parent: any
  ) {
    const {
      x1: parentX1,
      y1: parentY1,
      x2: parentX2,
      y2: parentY2
    } = parent.data("bounds");

    const { component } = element.data("bounds");

    const rect = new Rect()
      .size(width, height)
      .move(x, y)
      .fill("red")
      .stroke({
        color: "red",
        width: 2
      });

    const text = new Text()
      .text(component)
      .font({
        family: "Helvetica",
        size: "3rem",
        anchor: "end"
      })
      .move(x, y + height)
      .fill("white");

    const leftLine = this.createLines({
      x1: parentX1,
      y1: y + height / 2,
      x2: x,
      y2: y + height / 2
    });

    const rightLine = this.createLines({
      x1: x + width,
      y1: y + height / 2,
      x2: parentX2,
      y2: y + height / 2
    });

    const topLine = this.createLines({
      x1: x + width / 2,
      y1: parentY1,
      x2: x + width / 2,
      y2: y
    });

    const bottomLine = this.createLines({
      x1: x + width / 2,
      y1: y + height,
      x2: x + width / 2,
      y2: parentY2
    });

    const group = new G()
      .add(rect)
      .add(text)
      .add(leftLine)
      .add(rightLine)
      .add(topLine)
      .add(bottomLine);

    const addHighlight = () => {
      this.svgCanvas.add(group);
      group.insertBefore(element);
    };

    const removeHighlight = () => {
      group.remove();
    };

    return [addHighlight, removeHighlight];
  }

  // drawAny(annotations: any) {
  //   const iconGroup = this.svgCanvas.group().addClass("any");

  //   annotations.forEach((annotation: any, index: number) => {
  //     const { bounds, class_name, resource_id, text } = annotation;

  //     const { start, end } = bounds;
  //     const [x1, y1] = start;
  //     const [x2, y2] = end;

  //     const width = x2 - x1;
  //     const height = y2 - y1;

  //     const group = iconGroup.group().addClass(`any_${index}`);

  //     group
  //       .rect(width, height)
  //       .move(...start)
  //       .fill("transparent")
  //       .stroke({ color: "white", width: 2 });

  //     const [addHighlight, removeHighlight] = this.getHighlightListeners(
  //       x1,
  //       y1,
  //       width,
  //       height,
  //       group
  //     );

  //     group.on("mousemove", addHighlight);
  //     group.on("mouseleave", removeHighlight);
  //   });
  // }

  // drawImages(annotations: Annotation[]) {
  //   const iconGroup = this.svgCanvas.group().addClass("icons");

  //   annotations.forEach((annotation: Annotation, index: number) => {
  //     const { bounds, class_name, resource_id, text } = annotation;

  //     const { start, end } = bounds;
  //     const [x1, y1] = start;
  //     const [x2, y2] = end;

  //     const width = x2 - x1;
  //     const height = y2 - y1;

  //     const group = iconGroup.group().addClass(`icon_${index}`);

  //     group
  //       .rect(width, height)
  //       .move(...start)
  //       .fill("transparent")
  //       .stroke({ color: "white", width: 2 });
  //     group.line(x1, y1, x2, y2).stroke({ color: "#FFF", width: 2 });
  //     group
  //       .line(x1 + width, y1, x2 - width, y2)
  //       .stroke({ color: "#FFF", width: 2 });

  //     const [addHighlight, removeHighlight] = this.getHighlightListeners(
  //       x1,
  //       y1,
  //       width,
  //       height,
  //       group
  //     );

  //     group.on("mousemove", addHighlight);
  //     group.on("mouseleave", removeHighlight);
  //   });
  // }

  // drawIcons(annotations: Annotation[]) {
  //   const iconGroup = this.svgCanvas.group().addClass("icons");

  //   // const maskRectVert = new Rect

  //   annotations.forEach((annotation: Annotation, index: number) => {
  //     const { bounds, class_name, resource_id, text } = annotation;

  //     const { start, end } = bounds;
  //     const [x1, y1] = start;
  //     const [x2, y2] = end;

  //     const width = x2 - x1;
  //     const height = y2 - y1;

  //     const group = iconGroup.group().addClass(`icon_${index}`);

  //     group
  //       .rect(width, height)
  //       .move(...start)
  //       .fill("transparent")
  //       .stroke({ color: "white", width: 2 });

  //     const mask = new Mask()
  //       .rect(width / 2, height / 2)
  //       .move(x1 + width / 4, y1);

  //     group.maskWith(mask);

  //     const [addHighlight, removeHighlight] = this.getHighlightListeners(
  //       x1,
  //       y1,
  //       width,
  //       height,
  //       group
  //     );

  //     group.on("mousemove", addHighlight);
  //     group.on("mouseleave", removeHighlight);
  //   });
  // }
}
