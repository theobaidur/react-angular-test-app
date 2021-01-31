import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormHolderComponent } from './components/form-holder/form-holder.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PensionPlanningComponent } from './components/pension-planning/pension-planning.component';
import { LeftBehindPlanningComponent } from './components/left-behind-planning/left-behind-planning.component';
import { DisabilityPlanningComponent } from './components/disability-planning/disability-planning.component';

@NgModule({
  declarations: [
    AppComponent,
    FormHolderComponent,
    ProfileComponent,
    PensionPlanningComponent,
    LeftBehindPlanningComponent,
    DisabilityPlanningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
