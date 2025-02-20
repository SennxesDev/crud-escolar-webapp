import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit{

  public username:string = "";
  public password:string = "";
  public type: string = "password";
  public errors:any = {};
  public load:boolean = false;

  constructor(
    private router: Router
  ){}

  ngOnInit(): void {

  }

  public login(){

  }

  public showPassword(){

  }

  public registrar(){
    this.router.navigate(["registro-usuario"]);
  }
}
