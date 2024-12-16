import { convertDateToCalendarDate } from "@/lib/functions/DateFunctions";
import {
  CalendarDate,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  Time,
  today,
} from "@internationalized/date";
import { Button, ButtonGroup, Calendar, DateValue } from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { useEffect, useState } from "react";

interface optionsProps {
  available_dates: any[];
}

export default function CalendarPickDate({
  calendarDateTime,
  setCalendarDateTime,
  options,
}: {
  calendarDateTime: any;
  setCalendarDateTime: (date: any) => void;
  options: optionsProps;
}) {
  const handleCalendarChangeUpdate = (date: DateValue) => {
    const calendarToDate = date.toDate("America/Montevideo");
    setCalendarDateTime(calendarToDate);
  };

  let defaultDate = today(getLocalTimeZone());
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  let nextMonth = startOfMonth(now.add({ months: 1 }));

  const [optionsToDate, setOptionsToDate] = useState<Date[]>([]);

  let isDateUnavailable = (date: DateValue) => {
    // Convierte calendarToDate en un objeto Date en la misma zona horaria
    const calendarToDate = date.toDate("America/Montevideo");

    // Si no hay fechas disponibles, no está deshabilitado
    if (optionsToDate.length === 0) {
      return true;
    }

    // Verifica si la fecha ya ha pasado o si no está en las fechas habilitadas
    return !optionsToDate.some((optionDate) => {
      // Comparar solo la fecha (sin hora) para asegurar que coincida correctamente
      return (
        optionDate.getFullYear() === calendarToDate.getFullYear() &&
        optionDate.getMonth() === calendarToDate.getMonth() &&
        optionDate.getDate() === calendarToDate.getDate()
      );
    });
  };

  const [focusedDate, setFocusedDate] = useState(defaultDate);

  const handleCalendarChange = (date: DateValue) => {
    // setCalendarDateTime(date.toDate("America/Montevideo"));
  };
  const focusDate = (date: CalendarDate) => {
    setFocusedDate(date);
  };

  useEffect(() => {
    if (options) {
      setOptionsToDate(
        options.available_dates.map((date: any) => new Date(date))
      );
      console.log(options);
    }
  }, [options]);

  return (
    <Calendar
      aria-label="Date"
      id="fecha_hora_entrega"
      className="flex flex-col min-w-[20rem] items-center "
      //   showMonthAndYearPickers
      value={convertDateToCalendarDate(calendarDateTime || new Date())}
      onChange={handleCalendarChangeUpdate}
      isDateUnavailable={isDateUnavailable}
      focusedValue={focusedDate}
      onFocusChange={(date) => setFocusedDate(date)}
      //   focusedValue={formData.fecha_hora_entrega}
      topContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() => {
              handleCalendarChange(now);
              focusDate(now);
            }}
          >
            Hoy
          </Button>
          <Button
            onPress={() => {
              handleCalendarChange(nextWeek);
              focusDate(nextWeek);
            }}
          >
            Próxima semana
          </Button>
          <Button
            onPress={() => {
              handleCalendarChange(nextMonth);
              focusDate(nextMonth);
            }}
          >
            Próximo mes
          </Button>
        </ButtonGroup>
      }
    />
  );
}
