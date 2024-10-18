import { CalendarDate, Time } from "@internationalized/date";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
  // Extrae año, mes y día del objeto Date
  const year = date.getUTCFullYear(); // Usa getUTCFullYear para evitar problemas de zona horaria
  const month = date.getUTCMonth() + 1; // Los meses en Date están basados en 0 (0-11)
  const day = date.getUTCDate();

  // Crea una instancia de CalendarDate
  return new CalendarDate(year, month, day);
};

export const convertCalendarDateToDate = (date: CalendarDate): Date => {
  const calendarToDate = date.toDate("America/Montevideo");
  calendarToDate.setHours(12, 0, 0);

  return calendarToDate;
};
export const converDateToTime = (date: Date): Time => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return new Time(hours, minutes, seconds);
};

export const convertDateToISOFormat = (date: Date): string => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num: number) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
};

export const getDateInYYYY = (diferencial: number = 0) => {
  const ahora = new Date();

  // restar en milisegundos a ahora
  ahora.setTime(ahora.getTime() + diferencial);

  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
  const dia = String(ahora.getDate()).padStart(2, "0");
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");

  return `${año}${mes}${dia}${horas}${minutos}${segundos}`;
};
