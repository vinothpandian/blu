import { Component, OnInit, Input } from "@angular/core";
import { DatasetService } from "../services/dataset.service";

@Component({
  selector: "app-ui-list-area",
  templateUrl: "./ui-list-area.component.html",
  styleUrls: ["./ui-list-area.component.scss"]
})
export class UiListAreaComponent implements OnInit {
  imageNames: string[] = [];
  constructor(private datasetService: DatasetService) {
    this.datasetService.imageNames.subscribe(imageNames => {
      this.imageNames = imageNames;
    });
  }

  ngOnInit() {}
}
