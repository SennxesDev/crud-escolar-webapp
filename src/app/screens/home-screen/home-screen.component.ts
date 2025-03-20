import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit{

  constructor(
    private facadeService: FacadeService,
    private router: Router
  ){}

  ngOnInit(): void {

  }

  public logout(){
    this.facadeService.logout().subscribe(
      (response)=>{
        console.log("Entró a cerrar sesión", response);
        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      }, (error)=>{
        console.error(error);
      }
    );
  }
}