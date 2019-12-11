export interface Annotation {
  class_name: string;
  bounds: {
    start: [number, number];
    end: [number, number];
  };
  resource_id: string;
  text: string;
}

export interface Annotations {
  [key: string]: Annotation[];
}
