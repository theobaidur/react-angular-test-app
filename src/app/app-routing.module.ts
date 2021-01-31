import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisabilityPlanningComponent } from './components/disability-planning/disability-planning.component';
import { LeftBehindPlanningComponent } from './components/left-behind-planning/left-behind-planning.component';
import { PensionPlanningComponent } from './components/pension-planning/pension-planning.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path: 'pension-planning', component: PensionPlanningComponent},
  {path: 'left-behind-planning', component: LeftBehindPlanningComponent},
  {path: 'disability-planning', component: DisabilityPlanningComponent},
  {path: '**', redirectTo: 'profile'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
