export interface Annotations {
  ancestors: string[];
  bounds: number[];
  children?: Annotations[];
  className: string;
  class: string;
  clickables: boolean;
  componentLabel?: string;
  text?: string;
}
