import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-ui-list-area",
  templateUrl: "./ui-list-area.component.html",
  styleUrls: ["./ui-list-area.component.scss"]
})
export class UiListAreaComponent implements OnInit {
  constructor() {}

  @Input() thumbnails: Blob[] = [];

  ngOnInit() {}
}
