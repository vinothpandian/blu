export interface Annotations {
  ancestors: string[];
  bounds: number[];
  children?: Annotations[];
  class: string;
  clickables: boolean;
  componentLabel?: string;
}
