import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "displayCase"
})
export class DisplayCasePipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    return value.replace(/_/g, " ");
  }
}
