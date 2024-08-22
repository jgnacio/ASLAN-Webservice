"use client";
import {
  DocumentTypes,
  DropShippingDelivery,
} from "@/Resources/API/Unicom/UnicomAPIRequets";
import {
  CalendarDate,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  Time,
  today,
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
  Spinner,
  Switch,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { sendPurchaseOrderRegistration } from "./_actions/send-purchase-order-registration";
import { DropShippingDeliveryState } from "@/Resources/API/Unicom/entities/PurchaseOrder/UnicomAPIPurchaseOrder";
import { useToast } from "@/components/ui/use-toast";
import {
  document_types,
  regularDeliveryMethods,
} from "@/Resources/API/Unicom/entities/PurchaseOrder/UnicomAPIPurchaseOrder";

import {
  convertDateToCalendarDate,
  convertDateToISOFormat,
  converDateToTime,
  convertCalendarDateToDate,
} from "@/lib/functions/DateFunctions";
import { Link } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function PurchaseOrder() {
  let defaultDate = today(getLocalTimeZone());
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  let nextMonth = startOfMonth(now.add({ months: 1 }));

  let isDateUnavailable = (date: DateValue) => date.compare(now) < 0;
  const { toast } = useToast();
  const router = useRouter();

  const {
    mutateAsync: server_sendPurchaseOrderRegistration,
    isPending,
    isSuccess,
    isError,
    data,
  } = useMutation({
    mutationFn: sendPurchaseOrderRegistration,
    onSuccess: () => {
      toast({
        title: "Orden de compra registrada",
        description: "La orden de compra ha sido registrada con éxito",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al registrar la orden de compra",
        description: error.message,
        variant: "destructive",
        action: (
          <ToastAction
            onClick={() => {
              router.push("/dashboard/cart");
            }}
            altText="Ir al carrito"
          >
            Ir al carrito
          </ToastAction>
        ),
      });
    },
  });

  const deliveryMethods = ["Entrega Dropshipping", "Entrega Regular"];
  // Estado general del formulario
  const [formData, setFormData] = useState({
    codigo_promocion: "",
    comentarios: "",
    comentarios_dt: "",
    fecha_hora_entrega: convertCalendarDateToDate(defaultDate),
    forma_entrega: "",
  });
  const [focusedDate, setFocusedDate] = useState(defaultDate);

  const [dropshippingData, setDropshippingData] =
    useState<DropShippingDeliveryState>({
      codigo_dropshipping: 0,
      ciudad: "",
      departamento: "",
      direccion: "",
      documento: "",
      tipo_documento: DocumentTypes.Ci,
      hora_cierre: new Time(0, 0, 0),
      hora_entrega: new Time(0, 0, 0),
      hora_fin: new Time(0, 0, 0),
      apartamento: "",
      codpostal: "",
      email: "",
      enviar_qr_a_consumidor: false,
      latitud: 0,
      longitud: 0,
      nombre_destinatario: "",
      operador_logistico: "",
      tel: "",
    });

  const [regularDeliveryData, setRegularDeliveryData] = useState({
    forma_entrega: "",
    codigo_direccion: "",
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

  const handleTimeChange = (value: Time) => {
    const dateCalendar = formData.fecha_hora_entrega;

    dateCalendar.setHours(value.hour);
    dateCalendar.setMinutes(value.minute);
    dateCalendar.setSeconds(value.second);

    setFormData((prevFormData) => ({
      ...prevFormData,
      fecha_hora_entrega: dateCalendar,
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

  const handleDropshippingQrSwitchChange = (isChecked: boolean) => {
    setDropshippingData((prevDropshippingData) => ({
      ...prevDropshippingData,
      enviar_qr_a_consumidor: isChecked,
    }));
  };

  const handleDropshippingTimeChange = (value: Time, key: string) => {
    setDropshippingData((prevDropshippingData) => ({
      ...prevDropshippingData,
      [key]: value,
    }));
  };

  const handleRegularInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setRegularDeliveryData((prevRegularDeliveryData) => ({
      ...prevRegularDeliveryData,
      [id]: value,
    }));
  };

  const handleRegularSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setRegularDeliveryData((prevRegularDeliveryData) => ({
      ...prevRegularDeliveryData,
      forma_entrega: value,
    }));
  };

  // Función para manejar cambios en el calendario
  const handleCalendarChange = (date: CalendarDate) => {
    const calendarToDate = date.toDate("America/Montevideo");
    calendarToDate.setHours(
      formData.fecha_hora_entrega.getHours(),
      formData.fecha_hora_entrega.getMinutes(),
      formData.fecha_hora_entrega.getSeconds()
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      fecha_hora_entrega: calendarToDate,
    }));
  };

  const handleCalendarChangeUpdate = (date: DateValue) => {
    const calendarToDate = date.toDate("America/Montevideo");
    calendarToDate.setHours(
      formData.fecha_hora_entrega.getHours(),
      formData.fecha_hora_entrega.getMinutes(),
      formData.fecha_hora_entrega.getSeconds()
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      fecha_hora_entrega: calendarToDate,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // crear una copia del objeto formData
    let data = { ...formData } as any;
    // agregar los datos de dropshipping al objeto data, si es que no tiene forma de entrega regular
    if (data.forma_entrega === "Entrega Dropshipping") {
      data.forma_entrega = {
        entrega_dropshipping: { ...dropshippingData },
      };
      data.forma_entrega.entrega_dropshipping.codigo_dropshipping = Math.floor(
        Number(data.forma_entrega.entrega_dropshipping.codigo_dropshipping)
      );
      data.forma_entrega.entrega_dropshipping.latitud = Math.floor(
        Number(data.forma_entrega.entrega_dropshipping.latitud)
      );
      data.forma_entrega.entrega_dropshipping.longitud = Math.floor(
        Number(data.forma_entrega.entrega_dropshipping.longitud)
      );

      const fecha_entregaBuffer = data.fecha_hora_entrega as Date;

      fecha_entregaBuffer.setHours(
        (data.forma_entrega.entrega_dropshipping.hora_entrega as Time).hour,
        (data.forma_entrega.entrega_dropshipping.hora_entrega as Time).minute,
        (data.forma_entrega.entrega_dropshipping.hora_entrega as Time).second
      );

      data.forma_entrega.entrega_dropshipping.hora_entrega =
        convertDateToISOFormat(fecha_entregaBuffer);

      fecha_entregaBuffer.setHours(
        (data.forma_entrega.entrega_dropshipping.hora_cierre as Time).hour,
        (data.forma_entrega.entrega_dropshipping.hora_cierre as Time).minute,
        (data.forma_entrega.entrega_dropshipping.hora_cierre as Time).second
      );

      data.forma_entrega.entrega_dropshipping.hora_cierre =
        convertDateToISOFormat(fecha_entregaBuffer);

      fecha_entregaBuffer.setHours(
        (data.forma_entrega.entrega_dropshipping.hora_fin as Time).hour,
        (data.forma_entrega.entrega_dropshipping.hora_fin as Time).minute,
        (data.forma_entrega.entrega_dropshipping.hora_fin as Time).second
      );

      data.forma_entrega.entrega_dropshipping.hora_fin =
        convertDateToISOFormat(fecha_entregaBuffer);
    }

    // agregar los datos de entrega regular al objeto data, si es que no tiene forma de entrega dropshipping
    if (data.forma_entrega === "Entrega Regular") {
      data.forma_entrega = regularDeliveryData;
    }

    data.fecha_hora_entrega = convertDateToISOFormat(data.fecha_hora_entrega);

    // TODO - Implementar la validacion de los datos del formulario
    valitadeSubmit(data);

    console.log("Data to Send:", data);

    // console.log("Data FromData:", formData);
    // console.log("Data DropshippingData:", dropshippingData);

    // enviar la orden de compra al servidor
    await server_sendPurchaseOrderRegistration(data);
  };

  // AUX FUNCTIONS
  const valitadeSubmit = (data: any) => {
    return;
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orden de Compra</CardTitle>
        <CardDescription>
          Completa los datos para realizar la orden de compra con los productos
          en el carrito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
            <div className="w-full flex justify-center">
              <Calendar
                aria-label="Date"
                id="fecha_hora_entrega"
                className="flex flex-col min-w-[22rem] items-center "
                showMonthAndYearPickers
                value={convertDateToCalendarDate(formData.fecha_hora_entrega)}
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
            <div className="space-y-4 flex flex-col justify-center items-center">
              <TimeInput
                label="Hora de entrega"
                description="Ingresa la hora de entrega"
                className="max-w-xs"
                id="hora_entrega"
                isRequired
                onChange={handleTimeChange}
                defaultValue={converDateToTime(formData.fecha_hora_entrega)}
                startContent={
                  <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
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
          <br />
          <Card className="border-0 ">
            <CardHeader>
              <CardTitle>
                <label htmlFor="forma_entrega">Forma de entrega</label>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className=" mt-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Informacion de la entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center flex-col space-y-4 ">
                      <Input
                        type="number"
                        id="codigo_dropshipping"
                        label="Codigo Dropshipping"
                        placeholder="Ingresa el codigo Dropshipping"
                        className="max-w-xs"
                        isRequired
                        value={dropshippingData.codigo_dropshipping.toString()}
                        onChange={handleDropshippingInputChange}
                      />
                      <TimeInput
                        label="Hora de entrega (Dropshipping)"
                        description="Selecciona la hora de entrega"
                        id="hora_entrega_dropshipping"
                        className="max-w-xs"
                        isRequired
                        onChange={(value) =>
                          handleDropshippingTimeChange(value, "hora_entrega")
                        }
                        defaultValue={dropshippingData.hora_entrega}
                        startContent={
                          <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
                        }
                      />
                      <TimeInput
                        label="Hora de cierre"
                        description="Selecciona la hora de cierre"
                        className="max-w-xs"
                        isRequired
                        onChange={(value) =>
                          handleDropshippingTimeChange(value, "hora_cierre")
                        }
                        defaultValue={dropshippingData.hora_cierre}
                        startContent={
                          <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
                        }
                      />
                      <TimeInput
                        label="Hora fin"
                        description="Selecciona la hora fin"
                        className="max-w-xs"
                        isRequired
                        onChange={(value) =>
                          handleDropshippingTimeChange(value, "hora_fin")
                        }
                        defaultValue={dropshippingData.hora_fin}
                        startContent={
                          <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Informacion del destinatario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center flex-col space-y-4">
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
                          <SelectItem
                            key={document.value}
                            value={document.value}
                          >
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Informacion de la direccion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center flex-col space-y-4">
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
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        Informacion Adicional
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-start  space-y-8">
                      <Switch
                        isSelected={dropshippingData.enviar_qr_a_consumidor}
                        onValueChange={handleDropshippingQrSwitchChange}
                      >
                        Enviar QR a consumidor
                      </Switch>
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
                      <Input
                        id="factura_base64"
                        type="file"
                        label="Subir Factura"
                        className="max-w-xs"
                        startContent={
                          <FaFileImage className=" text-default-400 pointer-events-none  flex-shrink-0 " />
                        }
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              <br />
              {formData.forma_entrega === "Entrega Regular" && (
                <div className=" mt-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Entrega</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-start  space-y-8">
                      <Select
                        id="forma_entrega"
                        label="Forma en que se solicita la entrega"
                        className="max-w-xs"
                        value={regularDeliveryData.forma_entrega}
                        defaultSelectedKeys={["entrega_en_mostrador"]}
                        onChange={handleRegularSelectChange}
                        isRequired
                      >
                        {regularDeliveryMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        id="codigo_direccion"
                        label="Codigo Direccion"
                        placeholder="Ingresa el codigo de direccion"
                        className="max-w-xs"
                        value={regularDeliveryData.codigo_direccion}
                        onChange={handleRegularInputChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              {isError && "Error"}
            </CardContent>
            <CardFooter>
              <div className="block">
                <Button color="primary" type="submit" disabled={isPending}>
                  {isPending ? <Spinner color="white" size="sm" /> : "Enviar"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </CardContent>
    </Card>
  );
}
