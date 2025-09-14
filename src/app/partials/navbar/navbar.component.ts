import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
declare var $:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  @Input() tipo: string = "";
  @Input() rol:string ="";

  public token : string = "";
  public editar:boolean = false;
  public evento:boolean = true;

  constructor(
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.rol=this.facadeService.getUserGroup();
    console.log("Rol user: ", this.rol);
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token=this.facadeService.getSessionToken();
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id']!=undefined){
      this.editar=true;
    }
  }

  public goRegistro(){
    this.router.navigate(["registro-usuarios"]);
  }

  public goEventos(){
    this.router.navigate(["registro-eventos"]);
    this.evento=false;
  }

  //Cerrar Sesión
  public logout(){
    this.facadeService.logout().subscribe(
      (response)=>{
        console.log("Entró");

        this.facadeService.destroyUser();
        //Navega al user
        this.router.navigate(["/"]);
      }, (error)=>{
        console.error(error);
      }
    );
  }

  public clickNavLink(link: string){
    this.router.navigate([link]);
    setTimeout(() => {
      this.activarLink(link);
    }, 100);
  }

  public activarLink(link: string){
    if(link=="alumnos"){
      $("#principal").removeClass("active");
      $("#maestro").removeClass("active");
      $("#alumno").addClass("active")
    }else if(link=="maestros"){
      $("#principal").removeClass("active");
      $("#alumno").removeClass("active")
      $("#maestro").addClass("active");
    }else if(link=="home"){
      $("#alumno").removeClass("active")
      $("#maestro").removeClass("active");
      $("#principal").addClass("active");
    }else if(link=="graficas"){
      $("#alumno").removeClass("active")
      $("#maestro").removeClass("active");
      $("#principal").removeClass("active");
      $("#graficas").addClass("active");
    }else if(link=="eventos"){
      $("#alumno").removeClass("active")
      $("#maestro").removeClass("active");
      $("#principal").removeClass("active");
      $("#eventos").addClass("active");
    }
  }
}
