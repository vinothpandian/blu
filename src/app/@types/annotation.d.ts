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
  image_size?: [number, number];
  [key: string]: Annotation[] | [number, number];
}
