"use client";
import {
  DocumentTypes,
  DropShippingDelivery,
  RegularDelivery,
} from "@/Resources/API/Unicom/UnicomAPIRequets";
import {
  getLocalTimeZone,
  isWeekend,
  startOfMonth,
  startOfWeek,
  today,
  CalendarDate,
  Time,
} from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonGroup,
  Calendar,
  DateValue,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { PressEvent } from "@react-types/shared";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";
import { parseISO, format } from "date-fns";
import { Input as Inputcn } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFileImage } from "react-icons/fa";

export default function PurchaseOrder() {
  let defaultDate = today(getLocalTimeZone());
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  let nextMonth = startOfMonth(now.add({ months: 1 }));

  let isDateUnavailable = (date: DateValue) => date.compare(now) < 0;

  const deliveryMethods = ["Entrega Dropshipping", "Entrega Regular"];
  // Estado general del formulario
  const [formData, setFormData] = useState({
    codigo_promocion: "",
    comentarios: "",
    comentarios_dt: "",
    fecha_hora_entrega: defaultDate,
    forma_entrega: "",
  });
  const [focusedDate, setFocusedDate] = useState(defaultDate);

  const document_types = [
    {
      label: "Cédula de identidad",
      value: "CI",
    },
    {
      label: "DNI",
      value: "DNI",
    },
    {
      label: "Pasaporte",
      value: "pasaporte",
    },
    {
      label: "Otro documento",
      value: "otro_documento",
    },
  ];

  const [dropshippingData, setDropshippingData] =
    useState<DropShippingDelivery>({
      codigo_dropshipping: 0,
      ciudad: "",
      departamento: "",
      direccion: "",
      documento: "",
      tipo_documento: DocumentTypes.Ci,
      hora_cierre: new Date().toISOString(),
      hora_entrega: new Date().toISOString(),
      hora_fin: new Date().toISOString(),
      apartamento: "",
      codpostal: "",
      email: "",
      enviar_qr_a_consumidor: false,
      etiqueta_base64: "",
      factura_base64: "",
      latitud: 0,
      longitud: 0,
      nombre_destinatario: "",
      operador_logistico: "",
      tel: "",
    });

  const handleDocumentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setDropshippingData((prevDropshippingData) => ({
      ...prevDropshippingData,
      tipo_documento: value as DocumentTypes,
    }));
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleDropshippingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setDropshippingData((prevDropshippingData) => ({
      ...prevDropshippingData,
      [id]: value,
    }));
  };

  // Función para manejar cambios en el calendario
  const handleCalendarChange = (date: CalendarDate) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fecha_hora_entrega: date,
    }));
  };

  const handleCalendarChangeUpdate = (date: CalendarDate) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fecha_hora_entrega: date,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      forma_entrega: value,
    }));
  };

  const focusDate = (date: CalendarDate) => {
    setFocusedDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Orden de compra</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fecha_hora_entrega">Fecha y hora de entrega</label>
          <div className="flex gap-x-4 ">
            <Calendar
              aria-label="Date (Uncontrolled)"
              id="fecha_hora_entrega"
              showMonthAndYearPickers
              value={formData.fecha_hora_entrega}
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
          </div>
          <div className="space-y-4">
            <Input
              type="text"
              id="codigo_promocion"
              label="Codigo Promocion"
              placeholder="Ingresa el codigo de promocion"
              className="max-w-xs"
              value={formData.codigo_promocion}
              onChange={handleInputChange}
            />
            <Textarea
              label="Comentarios"
              id="comentarios"
              placeholder="Ingresa tus comentarios (Opcional)"
              className="max-w-xs"
              value={formData.comentarios}
              onChange={handleInputChange}
            />
            <Textarea
              label="Comentarios DT"
              id="comentarios_dt"
              placeholder="Comentarios DT (Opcional)"
              className="max-w-xs"
              value={formData.comentarios_dt}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <label htmlFor="forma_entrega">Forma de entrega</label>
        <Select
          id="forma_entrega"
          label="Selecciona la forma de entrega"
          className="max-w-xs"
          value={formData.forma_entrega}
          onChange={handleSelectChange}
          isRequired
        >
          {deliveryMethods.map((method) => (
            <SelectItem key={method} value={method}>
              {method}
            </SelectItem>
          ))}
        </Select>
        {formData.forma_entrega === "Entrega Dropshipping" && (
          <div className="space-y-4">
            <Input
              type="text"
              id="codigo_dropshipping"
              label="Codigo Dropshipping"
              placeholder="Ingresa el codigo Dropshipping"
              className="max-w-xs"
              isRequired
              value={dropshippingData.codigo_dropshipping.toString()}
              onChange={handleInputChange}
            />
            <TimeInput
              label="Hora de entrega"
              description="Selecciona la hora de entrega"
              className="max-w-xs"
              isRequired
              defaultValue={
                new Time(
                  new Date(dropshippingData.hora_entrega).getHours(),
                  new Date(dropshippingData.hora_entrega).getMinutes()
                )
              }
              startContent={
                <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
              }
            />

            <TimeInput
              label="Hora de cierre"
              description="Selecciona la hora de cierre"
              className="max-w-xs"
              isRequired
              defaultValue={
                new Time(
                  new Date(dropshippingData.hora_entrega).getHours(),
                  new Date(dropshippingData.hora_entrega).getMinutes()
                )
              }
              startContent={
                <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <TimeInput
              label="Hora fin"
              description="Selecciona la hora fin"
              className="max-w-xs"
              isRequired
              defaultValue={
                new Time(
                  new Date(dropshippingData.hora_entrega).getHours(),
                  new Date(dropshippingData.hora_entrega).getMinutes()
                )
              }
              startContent={
                <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Input
              type="text"
              id="nombre_destinatario"
              label="Nombre del destinatario"
              placeholder="Ingresa el nombre del destinatario"
              className="max-w-xs"
              value={dropshippingData.nombre_destinatario}
              onChange={handleDropshippingInputChange}
            />
            <Select
              id="document_type"
              label="Selecciona el tipo de documento"
              className="max-w-xs"
              value={dropshippingData.tipo_documento}
              onChange={handleDocumentTypeChange}
              isRequired
            >
              {document_types.map((document) => (
                <SelectItem key={document.value} value={document.value}>
                  {document.label}
                </SelectItem>
              ))}
            </Select>
            {dropshippingData.tipo_documento ? (
              <Input
                type="text"
                id="documento"
                label="Documento"
                placeholder="Ingresa el documento"
                className="max-w-xs"
                value={dropshippingData.documento}
                onChange={handleDropshippingInputChange}
              />
            ) : (
              ""
            )}
            <Input
              type="text"
              id="direccion"
              label="Direccion"
              placeholder="Ingresa la direccion"
              className="max-w-xs"
              value={dropshippingData.direccion}
              onChange={handleDropshippingInputChange}
            />
            <Input
              type="text"
              id="apartamento"
              label="Apartamento"
              placeholder="Ingresa la direccion del apartamento"
              className="max-w-xs"
              value={dropshippingData.apartamento}
              onChange={handleDropshippingInputChange}
            />
            <Input
              type="text"
              id="ciudad"
              label="Ciudad"
              placeholder="Ingresa la Ciudad"
              className="max-w-xs"
              value={dropshippingData.ciudad}
              onChange={handleDropshippingInputChange}
            />
            <Input
              type="text"
              id="departamento"
              label="Departamento"
              placeholder="Ingresa el departamento"
              className="max-w-xs"
              value={dropshippingData.departamento}
              onChange={handleDropshippingInputChange}
            />
            <Input
              type="text"
              id="codpostal"
              label="Codigo Postal"
              placeholder="Ingresa el codigo postal"
              className="max-w-xs"
              value={dropshippingData.codpostal}
              onChange={handleDropshippingInputChange}
            />
            <Input
              type="text"
              id="operador_logistico"
              label="Operador Logistico"
              placeholder="Ingresa el operador logistico"
              className="max-w-xs"
              value={dropshippingData.operador_logistico}
              onChange={handleDropshippingInputChange}
            />
            <Input
              id="etiqueta_base64"
              type="file"
              label="Subir Etiqueta"
              className="max-w-xs"
              startContent={
                <FaFileImage className=" text-default-400 pointer-events-none  flex-shrink-0 " />
              }
            />

            <div className="max-w-xs">
              <Accordion>
                <AccordionItem
                  key="1"
                  aria-label="Informacion Adicional"
                  subtitle="Presiona para expandir"
                  title="Informacion Adicional"
                >
                  <Input
                    type="text"
                    id="email"
                    label="Email"
                    placeholder="Ingresa el email"
                    className="max-w-xs"
                    value={dropshippingData.email}
                    onChange={handleDropshippingInputChange}
                  />
                  <Input
                    type="number"
                    id="tel"
                    label="Telefono"
                    placeholder="Ingresa el telefono"
                    className="max-w-xs"
                    value={dropshippingData.tel}
                    onChange={handleDropshippingInputChange}
                  />
                  <Input
                    id="factura_base64"
                    type="file"
                    label="Subir Factura"
                    className="max-w-xs"
                    startContent={
                      <FaFileImage className=" text-default-400 pointer-events-none  flex-shrink-0 " />
                    }
                  />
                  <Switch
                    checked={dropshippingData.enviar_qr_a_consumidor}
                    onChange={handleDropshippingInputChange}
                  >
                    Enviar QR a consumidor
                  </Switch>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
        {formData.forma_entrega === "Entrega Regular" && <p>Regular</p>}
        <div className="block">
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
