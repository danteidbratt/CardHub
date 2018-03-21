import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DealerComponent } from './dealer/dealer.component';

const routes: Routes = [
  {
    path: "",
    component: DealerComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
