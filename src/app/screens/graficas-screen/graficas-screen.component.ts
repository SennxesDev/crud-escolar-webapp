import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';


@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{
  //Agregar chartjs-plugin-datalabels
  //variables
  public total_user: any = {};

  // Gráfico de línea (eventos por día o mes)
  public lineChartData: ChartData<'line'> = {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Eventos registrados'
      }
    ]
  };

  public lineChartOption: any = {
    responsive: false
  };
  public lineChartPlugins = [DatalabelsPlugin];

  // Gráfico de barras (ej. eventos por tipo)
  public barChartData: ChartData<'bar'> = {
    labels: ['Conferencia', 'Taller', 'Seminario'],
    datasets: [
      {
        data: [45, 37, 80],
        label: 'Usuarios por evento',
        backgroundColor: ['#f88406', '#fcff44', '#82d3fb']
      }
    ]
  };

  public barChartOption: any = {
    responsive: false
  };
  public barChartPlugins = [DatalabelsPlugin];

  // Gráfico de pastel (usuarios por rol)
  public pieChartData!: ChartData<'pie'>;

  public pieChartOption: any = {
    responsive: false
  };
  public pieChartPlugins = [DatalabelsPlugin];

  // Gráfico de dona (usuarios por rol)
  public doughnutChartData!: ChartData<'doughnut'>;

  public doughnutChartOption: any = {
    responsive: false
  };
  public doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService
  ) {}

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log("Datos del backend:", this.total_user);

        // Actualizar gráficos de pastel y dona
        const admin = this.total_user.administradores || 0;
        const maestros = this.total_user.maestros || 0;
        const alumnos = this.total_user.alumnos || 0;

        this.pieChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [{
            data: [admin, maestros, alumnos],
            label: 'Usuarios registrados'
          }]
        };

        this.doughnutChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [{
            data: [admin, maestros, alumnos],
            label: 'Usuarios registrados'
          }]
        };

      },
      (error) => {
        alert("No se pudo obtener el total de usuarios");
      }
    );
  }
}
