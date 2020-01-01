import { Component, OnInit, Input } from "@angular/core";
import { DatasetService } from "../services/dataset.service";

@Component({
  selector: "app-ui-list-area",
  templateUrl: "./ui-list-area.component.html",
  styleUrls: ["./ui-list-area.component.scss"]
})
export class UiListAreaComponent implements OnInit {
  imageNames: string[] = [];
  filename: number = 1;
  constructor(private datasetService: DatasetService) {
    this.datasetService.imageNames.subscribe(imageNames => {
      this.imageNames = imageNames;
    });

    this.datasetService.filename.subscribe(filename => {
      this.filename = filename;
    });
  }

  ngOnInit() {}

  listClicked(index: number) {
    this.datasetService.setFilename(index + 1);
  }
}
