import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";

// ******** Angular Material modules *********
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatListModule,
  MatRippleModule
} from "@angular/material";

import { AppbarComponent } from "./appbar/appbar.component";
import { DisplayCasePipe } from "./pipes/display-case.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UiListAreaComponent } from "./ui-list-area/ui-list-area.component";

@NgModule({
  declarations: [
    AppComponent,
    AppbarComponent,
    DisplayCasePipe,
    UiListAreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatListModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
