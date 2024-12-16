"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  document_types,
  DropShippingDeliveryState,
  regularDeliveryMethods,
} from "@/Resources/API/Unicom/entities/PurchaseOrder/UnicomAPIPurchaseOrder";
import { DocumentTypes } from "@/Resources/API/Unicom/UnicomAPIRequets";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import {
  converDateToTime,
  convertCalendarDateToDate,
  convertDateToCalendarDate,
  convertDateToISOFormat,
} from "@/lib/functions/DateFunctions";
import { redirect, useRouter } from "next/navigation";
import { getUserDataForDropshipping } from "./_actions/get-user-data-for-dropshipping";
import SelectAvailableDateTime from "./components/SelectAvailableDateTime";
import SelectAddressRegularCode from "./components/SelectAddressRegularCode";
import { useAuth } from "@clerk/nextjs";

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
    mutateAsync: server_getUserDataForDropshipping,
    isPending: isPendingUserData,
    isSuccess: isSuccessUserData,
    isError: isErrorUserData,
    data: userData,
  } = useMutation({
    mutationFn: getUserDataForDropshipping,
    onSuccess: () => {
      toast({
        title: "Datos cargados",
        description: "Los datos han sido cargados con éxito",
      });
    },
  });

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
              router.push("/icc-aslan-dashboard/cart");
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
  const [calendarDateTime, setCalendarDateTime] = useState<Date>(new Date());
  const [focusedDate, setFocusedDate] = useState(defaultDate);
  const [billBase64, setBillBase64] = useState({
    factura: "",
    status: "",
  });

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

  const [dropshippingDirecction, setDropshippingDirecction] =
    useState<any>(null);

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

    if (value === "entrega_en_mostrador") {
      setRegularDeliveryData((prevRegularDeliveryData) => ({
        ...prevRegularDeliveryData,
        codigo_direccion: "",
      }));
    }
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

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      forma_entrega: value,
    }));

    if (value === "Entrega Regular") {
      setDropshippingDirecction(null);
    }

    await server_getUserDataForDropshipping();
  };

  const handleDropshippingDirecctionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    console.log("Value:", value);

    userData?.opciones_dropshipping?.forEach((option) => {
      if (option.codigo_metodo_entrega_especial === Number(value)) {
        setDropshippingDirecction(option);
      }
    });
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
      const code = Number(
        dropshippingDirecction.codigo_metodo_entrega_especial
      );

      data.forma_entrega.entrega_dropshipping.codigo_dropshipping = code;

      data.forma_entrega.entrega_dropshipping.latitud = Math.floor(
        Number(data.forma_entrega.entrega_dropshipping.latitud)
      );
      data.forma_entrega.entrega_dropshipping.longitud = Math.floor(
        Number(data.forma_entrega.entrega_dropshipping.longitud)
      );

      if (data.forma_entrega.entrega_dropshipping.latitud === 0) {
        delete data.forma_entrega.entrega_dropshipping.latitud;
      }

      if (data.forma_entrega.entrega_dropshipping.longitud === 0) {
        delete data.forma_entrega.entrega_dropshipping.longitud;
      }

      data.forma_entrega.entrega_dropshipping.factura_base64 =
        billBase64.factura;

      if (data.forma_entrega.entrega_dropshipping.documento === "") {
        delete data.forma_entrega.entrega_dropshipping.tipo_documento;
      }

      // drop fecha_hora_entrega
      delete data.fecha_hora_entrega;
    }

    // agregar los datos de entrega regular al objeto data, si es que no tiene forma de entrega dropshipping
    if (data.forma_entrega === "Entrega Regular") {
      console.log("RegularDeliveryData:", regularDeliveryData);
      data.forma_entrega = {};
      data.forma_entrega.entrega_regular = regularDeliveryData;
      data.fecha_hora_entrega = convertDateToISOFormat(data.fecha_hora_entrega);
    }

    // limpiar datos vacios de manera recursiva
    const cleanData = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object") cleanData(obj[key]);
        if (obj[key] === "" || obj[key] === null) delete obj[key];
      });
    };

    cleanData(data);

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

  const handleDropshippingDeliveryChangue = (value: string) => {
    const valueNumber = Number(value);

    const fecha_entrega =
      dropshippingDirecction.proximas_franjas_horarias_de_entrega[valueNumber];
    setDropshippingData((prevDropshippingData) => ({
      ...prevDropshippingData,
      hora_entrega: fecha_entrega.dia_hora_de_entrega,
      hora_cierre: fecha_entrega.dia_hora_de_corte,
      hora_fin: fecha_entrega.fin_dia_hora_entrega,
    }));
  };

  const handleReadBillInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Obtener el primer archivo (si existe)

    if (file) {
      // verificar el tipo de archivo si PDF o Imagen
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error al subir la factura",
          description: "El archivo debe ser una imagen o un PDF",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader(); // Crear una instancia de FileReader

      // Cuando la lectura se complete, obtendremos el Base64
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Archivo en Base64:", base64String);
        setBillBase64({
          factura: base64String,
          status: "loaded",
        });
      };

      reader.onprogress = (event) => {
        setBillBase64({
          factura: "",
          status: "loading",
        });
      };

      reader.onerror = (event) => {
        setBillBase64({
          factura: "",
          status: "error",
        });
      };

      // Leer el archivo como Data URL (esto incluye el Base64)
      reader.readAsDataURL(file);
    }
  };

  // useEffect(() => {
  //   if (dropshippingData) {
  //     console.log("DropshippingData:", dropshippingData);
  //   }
  // }, [dropshippingData]);

  // useEffect(() => {
  //   if (calendarDateTime) {
  //   }
  // }, [calendarDateTime]);

  useEffect(() => {
    if (isSuccessUserData) {
      console.log("UserData:", userData);
    }
  }, [userData]);

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
          <div className="space-y-4 flex flex-wrap justify-evenly">
            <Input
              type="text"
              id="codigo_promocion"
              label="Codigo Promocion"
              placeholder="Ingresa el codigo de promocion"
              size="lg"
              value={formData.codigo_promocion}
              onChange={handleInputChange}
            />
            <div className="hover:shadow-md rounded-xl transition-all px-4 w-full ">
              <Accordion>
                <AccordionItem
                  key="1"
                  aria-label="Comentarios"
                  title="Comentarios"
                >
                  <div className="flex justify-evenly items-center">
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
                </AccordionItem>
              </Accordion>
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
              <div className="space-x-4 flex items-center">
                <Select
                  id="forma_entrega"
                  label="Selecciona la forma de entrega"
                  className="max-w-xs"
                  value={formData.forma_entrega}
                  onChange={handleSelectChange}
                  isRequired
                  required
                >
                  {deliveryMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </Select>
                {formData.forma_entrega === "Entrega Dropshipping" &&
                  userData?.opciones_dropshipping && (
                    <Select
                      id="direcciones_entrega"
                      label="Selecciona la direccion de entrega"
                      className="max-w-xs"
                      value={
                        userData?.opciones_dropshipping[0].nombre_referencial
                      }
                      onChange={handleDropshippingDirecctionChange}
                      isRequired
                      required
                    >
                      {userData.opciones_dropshipping.map((option) => (
                        <SelectItem
                          key={
                            option.codigo_metodo_entrega_especial?.toString() ||
                            ""
                          }
                          value={option.nombre_referencial}
                        >
                          {option.nombre_referencial}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
              </div>

              {/* {dropshippingDirecction && (
                <pre>{JSON.stringify(dropshippingDirecction, null, 2)}</pre>
              )} */}

              {formData.forma_entrega === "Entrega Dropshipping" &&
                dropshippingDirecction && (
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
                          required
                          isDisabled
                          value={
                            dropshippingDirecction
                              ? dropshippingDirecction.codigo_metodo_entrega_especial
                              : dropshippingData.codigo_dropshipping.toString()
                          }
                          onChange={handleDropshippingInputChange}
                        />

                        {/* <CalendarPickDate
                          options={{
                            available_dates:
                              dropshippingDirecction.proximas_franjas_horarias_de_entrega.map(
                                (elements: any) => {
                                  return elements.dia_hora_de_corte;
                                }
                              ),
                          }}
                          calendarDateTime={calendarDateTime}
                          setCalendarDateTime={setCalendarDateTime}
                        /> */}
                        <SelectAvailableDateTime
                          available_hours={
                            dropshippingDirecction.proximas_franjas_horarias_de_entrega
                          }
                          onChange={handleDropshippingDeliveryChangue}
                          id="hora_entrega"
                          label="Fecha de entrega"
                          isRequired={true}
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
                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Input
                              isRequired
                              required
                              type="text"
                              id="nombre_destinatario"
                              label="Nombre del destinatario"
                              placeholder="Ingresa el nombre del destinatario"
                              className="max-w-xs"
                              value={dropshippingData.nombre_destinatario}
                              onChange={handleDropshippingInputChange}
                            />
                          ))}

                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_documento === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <>
                              <Select
                                id="document_type"
                                label="Selecciona el tipo de documento"
                                className="max-w-xs"
                                value={dropshippingData.tipo_documento}
                                onChange={handleDocumentTypeChange}
                                isRequired
                                required
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
                                  isRequired
                                  required
                                  disabled={!dropshippingData.tipo_documento}
                                  value={dropshippingData.documento}
                                  onChange={handleDropshippingInputChange}
                                />
                              ) : (
                                ""
                              )}
                            </>
                          ))}

                        <Input
                          type="email"
                          id="email"
                          label="Email"
                          placeholder="Ingresa el email"
                          className="max-w-xs"
                          isRequired={
                            (dropshippingDirecction &&
                              dropshippingDirecction.informacion_requerida
                                .requiere_email == "r_requerido") ||
                            dropshippingDirecction?.informacion_requerida
                              .requiere_nombre === "r_condicional"
                          }
                          required={
                            (dropshippingDirecction &&
                              dropshippingDirecction.informacion_requerida
                                .requiere_email == "r_requerido") ||
                            dropshippingDirecction?.informacion_requerida
                              .requiere_nombre === "r_condicional"
                          }
                          value={dropshippingData.email}
                          onChange={handleDropshippingInputChange}
                        />

                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_telefono === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Input
                              type="number"
                              id="tel"
                              label="Telefono"
                              placeholder="Ingresa el telefono"
                              className="max-w-xs"
                              isRequired
                              required
                              value={dropshippingData.tel}
                              onChange={handleDropshippingInputChange}
                            />
                          ))}
                      </CardContent>
                    </Card>

                    {(dropshippingDirecction &&
                      dropshippingDirecction?.informacion_requerida
                        .requiere_direccion === "r_requerido") ||
                      (dropshippingDirecction?.informacion_requerida
                        .requiere_nombre === "r_condicional" && (
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
                              isRequired
                              required
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
                              isRequired
                              required
                              value={dropshippingData.ciudad}
                              onChange={handleDropshippingInputChange}
                            />
                            <Input
                              type="text"
                              id="departamento"
                              label="Departamento"
                              placeholder="Ingresa el departamento"
                              className="max-w-xs"
                              isRequired
                              required
                              value={dropshippingData.departamento}
                              onChange={handleDropshippingInputChange}
                            />
                            <Input
                              type="text"
                              id="codpostal"
                              label="Codigo Postal"
                              placeholder="Ingresa el codigo postal"
                              className="max-w-xs"
                              isRequired
                              required
                              value={dropshippingData.codpostal}
                              onChange={handleDropshippingInputChange}
                            />
                          </CardContent>
                        </Card>
                      ))}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">
                          Informacion Adicional
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-start  space-y-8">
                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_envio_qr === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Switch
                              required
                              isSelected={
                                dropshippingData.enviar_qr_a_consumidor
                              }
                              onValueChange={handleDropshippingQrSwitchChange}
                            >
                              Enviar QR a consumidor
                            </Switch>
                          ))}
                        {dropshippingDirecction?.informacion_requerida
                          .requiere_operador_logistico === "r_requerido" ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Input
                              type="text"
                              id="operador_logistico"
                              label="Operador Logistico"
                              placeholder="Ingresa el operador logistico"
                              className="max-w-xs"
                              value={dropshippingData.operador_logistico}
                              onChange={handleDropshippingInputChange}
                            />
                          ))}

                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_imagen_etiqueta === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Input
                              required
                              id="etiqueta_base64"
                              type="file"
                              label="Subir Etiqueta"
                              className="max-w-xs"
                              startContent={
                                <FaFileImage className=" text-default-400 pointer-events-none  flex-shrink-0 " />
                              }
                            />
                          ))}
                        {(dropshippingDirecction &&
                          dropshippingDirecction?.informacion_requerida
                            .requiere_imagen_factura === "r_requerido") ||
                          (dropshippingDirecction?.informacion_requerida
                            .requiere_nombre === "r_condicional" && (
                            <Input
                              required
                              id="factura_base64"
                              type="file"
                              label="Subir Factura"
                              className="max-w-xs"
                              startContent={
                                <FaFileImage className=" text-default-400 pointer-events-none  flex-shrink-0 " />
                              }
                              onChange={handleReadBillInput}
                              isDisabled={billBase64.status === "loading"}
                              endContent={
                                billBase64.status === "loading" ? (
                                  <Spinner size="sm" />
                                ) : (
                                  ""
                                )
                              }
                            />
                          ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              <br />
              {formData.forma_entrega === "Entrega Regular" && userData && (
                <div className=" mt-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
                  <div className="w-full flex justify-center flex-col items-center space-y-4">
                    <Calendar
                      aria-label="Date"
                      id="fecha_hora_entrega"
                      className="flex flex-col min-w-[22rem] items-center "
                      showMonthAndYearPickers
                      value={convertDateToCalendarDate(
                        formData.fecha_hora_entrega
                      )}
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
                    <TimeInput
                      label="Hora de entrega"
                      description="Ingresa la hora de entrega"
                      className="max-w-xs"
                      id="hora_entrega"
                      isRequired
                      onChange={handleTimeChange}
                      defaultValue={converDateToTime(
                        formData.fecha_hora_entrega
                      )}
                      startContent={
                        <FaClock className=" text-default-400 pointer-events-none flex-shrink-0" />
                      }
                    />
                  </div>

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
                        onChange={handleRegularSelectChange}
                        isRequired
                        required
                      >
                        {regularDeliveryMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {regularDeliveryData.forma_entrega !==
                        "entrega_en_mostrador" && (
                        <SelectAddressRegularCode
                          id="codigo_direccion"
                          label="Selecciona la direccion"
                          addresses={userData.direcciones_entrega || []}
                        />
                      )}
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
