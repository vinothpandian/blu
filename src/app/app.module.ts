import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";

// ******** Angular Material modules *********
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { AppbarComponent } from "./appbar/appbar.component";
import { DisplayCasePipe } from "./pipes/display-case.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UiListAreaComponent } from "./ui-list-area/ui-list-area.component";
import { ScreensComponent } from './screens/screens.component';
import { ButtonComponent } from './elements/button/button.component';
import { IconComponent } from './elements/icon/icon.component';
import { TextComponent } from './elements/text/text.component';
import { AdvertisementComponent } from './elements/advertisement/advertisement.component';

@NgModule({
  declarations: [
    AppComponent,
    AppbarComponent,
    DisplayCasePipe,
    UiListAreaComponent,
    ScreensComponent,
    ButtonComponent,
    IconComponent,
    TextComponent,
    AdvertisementComponent
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
