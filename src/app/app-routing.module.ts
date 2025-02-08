import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';

const routes: Routes = [
  {path: '', component:LoginScreenComponent, pathMatch: 'full'},
  {path: 'registro-usuario', component:RegistroUsuariosScreenComponent, pathMatch: 'full'},
  {path: 'home', component:HomeScreenComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
