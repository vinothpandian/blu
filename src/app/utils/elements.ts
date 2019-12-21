import { Rect, G, Circle, Mask, Polyline, Text, Defs } from "@svgdotjs/svg.js";

export const backgroundColor = "#0b94ba";

export const getElementOutline = (
  label: string,
  elementDetails: ElementDetails
) => {
  switch (label.toLowerCase()) {
    case "advertisement":
      return drawAds(elementDetails);
    case "image":
      return drawImages(elementDetails);
    case "icon":
      return drawIcons(elementDetails);
    case "text":
      return drawTexts(elementDetails);
    case "input":
      return drawButtons(elementDetails);
    case "text button":
      return drawButtons(elementDetails);
    case "web view":
      return drawWebViews(elementDetails);
    default:
      console.log(elementDetails?.component);
      return drawAny(elementDetails);
  }
};

const drawAny = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1 } = elementDetails;

  const rect = new Rect()
    .size(width, height)
    .move(x1, y1)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    });

  return rect;
};

const drawImages = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1, x2, y2 } = elementDetails;

  const group = new G();

  group
    .rect(width, height)
    .move(x1, y1)
    .fill("transparent")
    .stroke({ color: "white", width: 2 });
  group.line(x1, y1, x2, y2).stroke({ color: "#FFF", width: 2 });
  group
    .line(x1 + width, y1, x2 - width, y2)
    .stroke({ color: "#FFF", width: 2 });

  return group;
};

const drawIcons = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1, x2, y2 } = elementDetails;
  const group = new G();

  group
    .rect(width, height)
    .move(x1, y1)
    .fill("transparent");

  group
    .polyline([x1, y1 + height / 4, x1, y1, x1 + width / 4, y1])
    .size(width / 4, height / 4)
    .move(x1, y1)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    });

  group
    .polyline([x2, y1 + height / 4, x2, y1, x2 - width / 4, y1])
    .size(width / 4, height / 4)
    .move(x2 - width / 4, y1)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    });

  group
    .polyline([
      x1,
      y1 + (3 * height) / 4,
      x1,
      y1 + height,
      x1 + width / 4,
      y1 + height
    ])
    .size(width / 4, height / 4)
    .move(x1, y1 + (3 * height) / 4)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    });

  group
    .polyline([x2, y1 + (3 * height) / 4, x2, y2, x2 - width / 4, y2])
    .size(width / 4, height / 4)
    .move(x2 - width / 4, y1 + (3 * height) / 4)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    });

  group
    .circle()
    .radius(height / 6)
    .fill("white")
    .center(x1 + width / 2, y1 + height / 2);

  return group;
};

const drawTexts = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1, x2, y2, text } = elementDetails;
  const group = new G();

  const defs = new Defs();

  const pattern = defs
    .pattern(15, 15, function(add) {
      add.line(0, 0, 0, 15).stroke({
        color: "white",
        width: 4
      });
    })
    .rotate(45);

  defs.addTo(group);

  group.rect(width, height).fill(pattern);

  group
    .text(text)
    .font({
      size: "2.5rem",
      family: "Roboto, Helvetica Neue, sans-serif",
      fill: "white"
    })
    .center(0.5 * width, 0.5 * height);

  group.move(x1, y1);

  return group;
};

const drawAds = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1 } = elementDetails;
  const group = new G();

  group
    .rect(width, height)
    .fill("transparent")
    .stroke({
      dasharray: "2 4",
      color: "white",
      width: 4
    });

  group
    .text(`Advertisement Banner ${width}px x ${height}px`)
    .font({
      anchor: "middle",
      size: "2.5rem",
      family: "Roboto, Helvetica Neue, sans-serif",
      fill: "white"
    })
    .center(0.5 * width, 0.5 * height);

  group.move(x1, y1);

  return group;
};

const drawButtons = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1, text } = elementDetails;
  const group = new G();

  group
    .rect(width, height)
    .fill("transparent")
    .radius(20)
    .stroke({
      color: "white",
      width: 4
    });

  group
    .text(text)
    .font({
      anchor: "middle",
      size: "2.5rem",
      family: "Roboto, Helvetica Neue, sans-serif",
      fill: "white"
    })
    .center(0.5 * width, 0.5 * height);

  group.move(x1, y1);

  return group;
};

const drawWebViews = (elementDetails: ElementDetails) => {
  const { width, height, x1, y1, text } = elementDetails;
  const group = new G();

  group
    .rect(width, height)
    .fill("transparent")
    .radius(20)
    .stroke({
      color: "white",
      width: 4
    });

  group
    .circle(0.75 * width)
    .fill("transparent")
    .stroke({
      color: "white",
      width: 4
    })
    .center(0.5 * width, 0.5 * height);

  group
    .text("Web view")
    .font({
      anchor: "middle",
      size: "2.5rem",
      family: "Roboto, Helvetica Neue, sans-serif",
      fill: "white"
    })
    .center(0.5 * width, 0.5 * height);

  group.move(x1, y1);

  return group;
};
