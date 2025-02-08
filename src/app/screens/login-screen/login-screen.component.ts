import { Component, OnInit } from '@angular/core';

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

  constructor(){}

  ngOnInit(): void {
    
  }

  public login(){

  }

  public showPassword(){

  }

  public registrar(){

  }
}
