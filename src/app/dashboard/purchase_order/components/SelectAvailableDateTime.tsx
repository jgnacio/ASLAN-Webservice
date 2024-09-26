import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectAvailableDateTime({
  id,
  label,
  className,
  value,
  onChange,
  isRequired,
  available_hours,
}: {
  id: string;
  label: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  isRequired?: boolean;
  available_hours: any[];
}) {
  return (
    <Select required={isRequired} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Selecciona la Entrega" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fecha | Horario de entrega - Fin</SelectLabel>
          {available_hours.map((hour: any, id) => (
            <SelectItem key={hour.dia_hora_de_corte} value={id.toString()}>
              {`${new Date(hour.dia_hora_de_corte)?.getDate()}/${
                new Date(hour.dia_hora_de_corte)?.getMonth() + 1
              }`}{" "}
              |{" "}
              {`${new Date(hour.dia_hora_de_entrega)?.getDate()}/${
                new Date(hour.dia_hora_de_entrega)?.getMonth() + 1
              } ${new Date(hour.dia_hora_de_entrega)?.getHours()}:${
                new Date(hour.dia_hora_de_entrega)?.getMinutes() === 0
                  ? "00"
                  : new Date(hour.dia_hora_de_entrega)?.getMinutes()
              }`}{" "}
              -{" "}
              {`${new Date(hour.fin_dia_hora_entrega)?.getHours()}:${
                new Date(hour.fin_dia_hora_entrega)?.getMinutes() === 0
                  ? "00"
                  : new Date(hour.fin_dia_hora_entrega)?.getMinutes()
              }`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
