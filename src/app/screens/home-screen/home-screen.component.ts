import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit{

  public rol:string = "";

  constructor(
    private facadeService: FacadeService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    console.log("Rol: ", this.rol);
  }

}