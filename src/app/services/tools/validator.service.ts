import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  //Funciones para validaciones
  required(input:any){
    return (input != undefined && input != null && input != "" && input.toString().trim().length > 0);
  }

  max(input:any, size:any){
    return (input.length <= size);
  }

  min(input:any, size:any){
    return (input.length >= size);
  }

  email(input:any){
    var regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return input.match(regEx); // Invalid format
  }

  date(input:any){
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!input.match(regEx)) return false;  // Invalid format
    var d = new Date(input);
    if(Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0,10) === input;
  }

  between(input:any, min:any, max:any){
    return (max >= input >= min);
  }

  numeric(input:any){
    return (!isNaN(parseFloat(input)) && isFinite(input));
  }

  maxDecimals(input:any, size:any) {
    let decimals = 0;

    if (Math.floor(input) !== input && input.toString().split(".")[1]){
      decimals = input.toString().split(".")[1].length
    }

    return (decimals <= size);
  }

  minDecimals(input:any, size:any) {
    let decimals = 0;

    if (Math.floor(input) !== input && input.toString().split(".")[1]){
      decimals = input.toString().split(".")[1].length
    }

    return (decimals >= size);
  }

  dateBetween(input:any, min:any, max:any){

    input = new Date(input).getTime();
    min = new Date(min).getTime();
    max = new Date(max).getTime();

    return  (max >= input && input  >= min);

  }

  words(input:any){
    let pat = new RegExp('^([A-Za-zÑñáéíóúÁÉÍÓÚ ]+)$');
    console.log(pat.test(input), input);
    return pat.test(input);
  }

  atLeastOneCheckboxSelected(checkboxes: any[]): boolean {
    return checkboxes && checkboxes.length > 0;
  }

  validarHoras(horaInicio: string, horaFin: string): boolean {
    if (!horaInicio || !horaFin) return false;

    // Convertir de 12h a formato 24h y luego a Date
    const convertirAHoras24 = (hora: string): Date => {
      let [time, modifier] = hora.split(' ');
      let [hours, minutes] = time.split(':');

      let hh = parseInt(hours, 10);
      let mm = parseInt(minutes, 10);

      if (modifier === 'PM' && hh < 12) hh += 12;
      if (modifier === 'AM' && hh === 12) hh = 0;

      const fecha = new Date();
      fecha.setHours(hh, mm, 0, 0); // Limpiamos segundos y milisegundos

      return fecha;
    };

    const inicio = convertirAHoras24(horaInicio);
    const fin = convertirAHoras24(horaFin);

    return fin > inicio;
  }

  fechaActualoFutura(dateStr: string): boolean {
    const inputDate = new Date(dateStr);
    const today = new Date();

    // Normaliza las fechas eliminando la hora
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate >= today;
  }

}
