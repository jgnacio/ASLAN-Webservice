import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectAddressRegularCode({
  id,
  label,
  className,
  value,
  onChange,
  isRequired,
  addresses,
}: {
  id: string;
  label: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  isRequired?: boolean;
  addresses: any[];
}) {
  return (
    <Select required={isRequired} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Selecciona la dirección" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {addresses.map((address: any, id) => (
            <SelectItem key={address.codigo_direccion} value={id.toString()}>
              {address.direccion}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
