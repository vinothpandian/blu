import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import { Annotations } from "../@types/annotation";
import { SVG, Svg, Rect, Text, G } from "@svgdotjs/svg.js";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";

import domToImage from "dom-to-image";
import { saveAs } from "file-saver";

import isEmpty from "lodash/fp/isEmpty";
import { getElementOutline, backgroundColor } from "../utils/elements";

interface AnnotationNode {
  name: string;
  className: string;
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
  @ViewChild("tree", { static: false }) tree: any;
  getKeys = Object.keys;

  category: string;
  appName: string;
  filename: number;

  imagePath: string = "";
  annotations: Annotations;
  svgCanvas: any;

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

      this.svgCanvas.rect(this.width, this.height).fill(backgroundColor);

      const group = new G().addClass("root").addTo(this.svgCanvas);

      group.data("bounds", {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,
        width: width,
        height: height,
        component: "root",
        text: "",
        className: this.annotations.className
      });

      this.parseAnnotations(rest?.children, group);

      const children = this.buildAnnotationTree(annotations?.children, []);

      this.TREE_DATA = [
        {
          name: "root",
          className: this.annotations.className,
          children
        }
      ];

      this.dataSource.data = this.TREE_DATA;
      this.treeControl.dataNodes = this.TREE_DATA;
      this.tree.treeControl.expandAll();
    });
  }

  hasChild = (_: number, node: AnnotationNode) =>
    !!node.children && node.children.length > 0;

  buildAnnotationTree(annotations: Annotations[], []): AnnotationNode[] {
    const children = annotations.reduce(
      (previousValue: AnnotationNode[], currentValue: Annotations) => {
        const name = currentValue?.componentLabel ?? "root";
        const { className } = currentValue;

        let children = [];

        if (Object.keys(currentValue).includes("children")) {
          children = this.buildAnnotationTree(currentValue.children, []);
        }

        if (isEmpty(children)) {
          return [...previousValue, { name, className }];
        }

        return [
          ...previousValue,
          {
            name,
            className,
            children
          }
        ];
      },
      []
    );

    return children;
  }

  parseAnnotations(annotations: Annotations[], parent: G) {
    annotations.forEach((annotations: Annotations) => {
      const label = annotations?.componentLabel ?? "group";

      const className = annotations.className;

      const group = new G().addClass(className);

      const { bounds } = annotations;
      const [x1, y1, x2, y2] = bounds;

      const width = x2 - x1;
      const height = y2 - y1;

      const text = annotations?.text ?? "";

      const elementDetails: ElementDetails = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width: width,
        height: height,
        component: label,
        text,
        className
      };

      group.data("bounds", elementDetails);

      const element = getElementOutline(label, elementDetails);

      group.add(element);
      parent.add(group);

      const [addHighlight, removeHighlight] = this.getHighlightListeners(
        x1,
        y1,
        width,
        height,
        group,
        parent
      );

      element.on("mouseover", addHighlight);
      element.on("mouseout", removeHighlight);

      if (Object.keys(annotations).includes("children")) {
        this.parseAnnotations(annotations.children, group);
      }

      return;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  createLines({ x1, y1, x2, y2 }, isVertical = false) {
    const group = new G();

    group.line([x1, y1, x2, y2]).stroke({
      color: "white",
      width: 4
    });

    let textX = x1 + 30;
    let textY = y1 + 30;

    if (isVertical) {
      textY = (y1 + y2) / 2;
    } else {
      textX = (x1 + x2) / 2;
    }

    const text = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    group
      .text(`${text}px`)
      .move(textX, textY)
      .fill("gold")
      .font({
        family: "Helvetica",
        size: "3rem",
        anchor: isVertical ? "start" : "end",
        weight: 500
      });

    return group;
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

    const { component, className } = element.data("bounds");

    const rect = new Rect()
      .size(width, height)
      .move(x, y)
      .fill("transparent")
      .stroke({
        color: "gold",
        width: 10
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

    const topLine = this.createLines(
      {
        x1: x + width / 2,
        y1: parentY1,
        x2: x + width / 2,
        y2: y
      },
      true
    );

    const bottomLine = this.createLines(
      {
        x1: x + width / 2,
        y1: y + height,
        x2: x + width / 2,
        y2: parentY2
      },
      true
    );

    const group = new G()
      .add(rect)
      .add(text)
      .add(leftLine)
      .add(rightLine)
      .add(topLine)
      .add(bottomLine);

    const addHighlight = () => {
      this.updateTreeNodeClassName(className, this.TREE_DATA);
      this.svgCanvas.add(group);
      group.insertBefore(element);
    };

    const removeHighlight = () => {
      this.updateTreeNodeClassName(
        `${className} found_this_node`,
        this.TREE_DATA,
        false
      );
      group.remove();
    };

    return [addHighlight, removeHighlight];
  }

  updateTreeNodeClassName(
    className: string,
    tree: AnnotationNode[],
    addClass: boolean = true
  ) {
    tree.forEach((annotationNode: AnnotationNode) => {
      if (className === annotationNode.className) {
        if (addClass) {
          annotationNode.className += ` found_this_node`;
          return;
        }

        annotationNode.className = annotationNode.className.replace(
          " found_this_node",
          ""
        );

        return;
      }

      if (Object.keys(annotationNode).includes("children")) {
        return this.updateTreeNodeClassName(
          className,
          annotationNode.children,
          addClass
        );
      }
    });
  }

  downloadBlueprint() {
    const node = this.svgCanvas.svg();
    const blob = `data:image/svg+xml;utf8,${escape(node)}`;
    console.log(node);
    console.log(blob);
    saveAs(blob, "blueprint.svg");

    // function filter(node) {
    //   return node.tagName !== "i";
    // }

    // console.log(this.svgCanvas.svg());

    // domToImage.toSvg(node, { filter: filter }).then(image => {
    //   saveAs(image, "blueprint.svg");
    // });
  }

  downloadImage() {
    saveAs(this.imagePath, "original_image.jpg");
  }
}
