import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "[app-icon]",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"]
})
export class IconComponent implements OnInit {
  @Input() boxes = [];

  constructor() {}

  ngOnInit() {
    console.log(this.boxes);
  }
}
