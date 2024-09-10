"use client";
import { Check, ImagePlus, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ProductType } from "@/domain/product/entities/Product";
import { useState } from "react";

import { schemaPublishProduct } from "@/domain/schema/plublish-product.schema";
import { validateFormData } from "@/lib/Utils/validation";
import { Spinner } from "@nextui-org/spinner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { publishProduct } from "../_actions/publish-product";
import ProductDescriptionEditor from "../edit/components/ProductDescriptionEditor";
import { FormPublishProduct } from "./types/formTypes";
import { imageListProps, imageProps } from "./types/imageTypes";

export function ProductEdit({ product }: { product: ProductType }) {
  const [imageTemplate, setImageTemplate] = useState<imageProps>({
    name: "",
    src: "",
    content: null,
    type: "",
    filename: "",
  });
  const [file, setFile] = useState<imageListProps | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [contentDescripcion, serContentDescripcion] = useState<string>(
    product.description
  );

  const [productState, setProductState] = useState<FormPublishProduct>({
    ...product,
    publishState: "draft",
  });

  const router = useRouter();
  const { toast } = useToast();

  const {
    mutateAsync: server_publishProduct,
    isError: isErrorPublish,
    isSuccess: isSuccessPublish,
  } = useMutation({
    mutationFn: (product: ProductType) => publishProduct(product),
    onSuccess: () => {
      toast({
        title: "Producto publicado",
        description: "El producto fue publicado con éxito.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Hubo un error al publicar el producto.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: any) => {
    setImageTemplate({
      name: e.target.files[0].name,
      src: URL.createObjectURL(e.target.files[0]),
      content: e.target.files[0],
      type: e.target.files[0].type,
      filename: e.target.files[0].name,
    });
  };

  function addToImages() {
    if (imageTemplate.src === "") {
      toast({
        title: "Error",
        description: "No se ha seleccionado ninguna imagen.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      setFile([
        {
          name: imageTemplate.name,
          src: imageTemplate.src,
          content: imageTemplate.content,
          type: imageTemplate.type,
          filename: imageTemplate.filename,
        },
      ]);

      return;
    }
    // check first if there img allerady not exists on the file array
    const name = file.map((i) => {
      if (i.name === imageTemplate.name) {
        toast({
          title: "Error",
          description: "La imagen ya fue cargada anteriormente.",
          variant: "destructive",
        });
        return i.name;
      }
    });

    if (name.includes(imageTemplate.name)) {
      return;
    }

    const fileCopy = [...file];
    fileCopy.push({
      name: imageTemplate.name,
      src: imageTemplate.src,
      content: imageTemplate.content,
      type: imageTemplate.type,
      filename: imageTemplate.filename,
    });

    setFile(fileCopy);

    toast({
      title: "Imagen cargada",
      description: "La imagen fue cargada con éxito.",
      variant: "default",
    });
  }

  function removeImage(name: string) {
    const fileCopy = file?.filter((i) => i.name !== name);

    if (!fileCopy) {
      setFile([]);
      return;
    }
    setFile(fileCopy);
  }

  async function SubmitImageToProduction(
    imgName: string
  ): Promise<number | undefined> {
    const img = file?.filter((i) => i.name === imgName);
    if (img && img[0]) {
      const { name: title, filename, content, type } = img[0];

      if (content) {
        const formData = new FormData();
        formData.append("file", content, filename); // El archivo es añadido directamente a FormData
        formData.append("title", title); // Puedes añadir otros datos también

        const response = await axios.post("/api/upload", formData);

        const id = response.data.result.id || undefined;

        return id;
      }
      return undefined;
    }
  }

  async function submitImagesToProduction(): Promise<
    | { src?: string; id: number | null }[]
    | { src: string; id?: number | null }[]
    | undefined
  > {
    if (file) {
      const ids: { id: number | null }[] = [];
      for (let i = 0; i < file.length; i++) {
        const img = file[i];
        try {
          const id = await SubmitImageToProduction(img.name);
          ids.push({ id: id || null });
        } catch (error) {
          toast({
            title: "Error",
            description: `Hubo un error al subir la imagen ${img.filename}.`,
            variant: "destructive",
          });
          break;
        }
      }

      if (ids.some((item) => item.id === null)) {
        return undefined;
      }

      // No actualices el estado aquí, retorna los ids
      return ids;
    }
  }
  async function handleSubmmit() {
    setIsSubmitting(true);
    try {
      const imagesIds = await submitImagesToProduction();
      let cleanImagesIds = [] as {
        id: number;
        src?: string;
      }[];
      if (imagesIds) {
        if (imagesIds.some((item) => item.id === null)) {
          setProductState({
            ...productState,
            images: [],
          });
          return;
        }

        // Filtrar los valores que tienen id nulo
        cleanImagesIds = imagesIds.filter((item) => item.id !== null) as {
          id: number;
          src?: string;
        }[];
      }
      const newProductStateBuffer = {
        ...productState,
        images: cleanImagesIds, // Aseguramos que solo se envían objetos válidos
      };
      const { errors, data } = validateFormData(
        schemaPublishProduct,
        newProductStateBuffer
      );

      if (errors) {
        return;
      }
      setProductState(data);
      await server_publishProduct(data);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      return;
    }
  }
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Manejo especial para el campo "price"
    if (id === "price") {
      // Si el campo está vacío, asignar un valor nulo
      const parsedValue = value === "" ? null : parseFloat(value);

      setProductState({
        ...productState,
        price:
          parsedValue !== null && !isNaN(parsedValue) && parsedValue >= 0
            ? parsedValue
            : 0,
      });
      return; // Salir de la función después de manejar el "price"
    }

    // Manejo genérico para otros campos
    setProductState({
      ...productState,
      [id]: value,
    });
  };

  return (
    <div className="mx-auto grid max-w-[70vw] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Publicar Producto
        </h1>
        <Badge
          variant={
            product.availability === "in_stock"
              ? "default"
              : product.availability === "out_of_stock"
              ? "destructive"
              : "warning"
          }
          className="ml-auto sm:ml-0"
        >
          {product.availability === "in_stock"
            ? "En Stock"
            : product.availability === "out_of_stock"
            ? "Sin Stock"
            : "Consultar disponibilidad"}
        </Badge>
        <Badge variant={"outline"}>{product.category.name}</Badge>
        {product.estimatedArrivalDate && (
          <Badge
            variant={"outline"}
            className="text-blue-400"
          >{`Llegada estimada: ${product.estimatedArrivalDate?.getDate()}/${
            product.estimatedArrivalDate?.getMonth() + 1
          }/${product.estimatedArrivalDate?.getFullYear()}`}</Badge>
        )}
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button
            onClick={() => router.push("/dashboard/products")}
            variant="outline"
            size="sm"
            disabled={isSubmitting}
          >
            {isSuccessPublish ? "Ir a Productos" : "Descartar"}
          </Button>
          <Button
            disabled={isSubmitting || isSuccessPublish}
            size="sm"
            onClick={handleSubmmit}
            variant={isSuccessPublish ? "success" : "default"}
          >
            {isSubmitting ? (
              <Spinner size="sm" color="white" />
            ) : isSuccessPublish ? (
              <Check />
            ) : (
              "Publicar"
            )}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Detalles del Producto</CardTitle>
              <CardDescription>
                Modifica los detalles del producto antes de publicarlo en ASLAN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Nombre</Label>
                  <Input
                    id="title"
                    type="text"
                    className="w-full"
                    onChange={handleProductChange}
                    value={productState.title}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Descripción</Label>
                  {/* EDITOR DE TEXTO PARA LA DESCRIPCION */}
                  <ProductDescriptionEditor
                    productState={productState}
                    setProductState={setProductState}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-3">
            <CardHeader>
              <CardTitle>Estado del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="publishState">Estado</Label>
                  <Select
                    onValueChange={(value) => {
                      setProductState({
                        ...productState,
                        publishState: value,
                      });
                    }}
                    value={productState.publishState}
                    defaultValue="draft"
                  >
                    <SelectTrigger
                      id="publishState"
                      aria-label="Selecciona el estado"
                    >
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem disabled value="published">
                        Publico
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-1">
            <CardHeader>
              <CardTitle>Identificadores</CardTitle>
              <CardDescription>
                Modifica los identificadores del producto antes de publicarlo en
                ASLAN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="partNumber">SKU Aslan</Label>
              <Input
                id="partNumberToSend"
                type="text"
                onChange={handleProductChange}
                value={productState.partNumberToSend}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">SKU</TableHead>
                    {/* <TableHead className="w-[20rem]">Value</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold flex-wrap">
                      {product.sku}
                    </TableCell>
                    {/* <TableCell className="flex items-center gap-4 flex-1">
                      <Label htmlFor="sku" className="sr-only">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        type="text"
                        onChange={handleProductChange}
                        value={productState.sku}
                        className="w-full "
                      />
                    </TableCell> */}
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Part Numbers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.partNumber && product.partNumber.length > 0 ? (
                    product.partNumber.map((partNumber, index) => (
                      <TableRow key={`partNumber-${index}`}>
                        <TableCell className="font-semibold flex-wrap">
                          {partNumber.partNumber}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <p>Sin Part Numbers Disponibles</p>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Imagenes</CardTitle>
              <CardDescription>
                Sube una imagen para mostrar en la publicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {file &&
                    file.map((img) => (
                      <Dialog key={img.name}>
                        <DialogTrigger>
                          {" "}
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#feaaaa",
                            }}
                            whileTap={{
                              scale: 0.9,
                              backgroundColor: "#fF6671",
                            }}
                            initial={{ backgroundColor: "#ffffff" }}
                            className="aspect-square items-center justify-center rounded-md border border-dashed h-[6rem] bg-opacity-0"
                          >
                            <img
                              alt="Product img"
                              src={img.src}
                              className="object-cover"
                            />
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Estas seguro de eliminar esta imagen?
                            </DialogTitle>
                            <DialogDescription>
                              <img
                                key={img.name}
                                alt="Product img"
                                src={img.src}
                                className="object-cover items-center justify-center rounded-md border border-dashed h-[70vh}"
                              />
                            </DialogDescription>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => removeImage(img.name)}
                                  color="primary"
                                >
                                  Eliminar
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ))}
                  <Drawer>
                    <DrawerTrigger
                      onClick={() => {
                        setImageTemplate({
                          name: "",
                          src: "",
                          content: null,
                          type: "",
                          filename: "",
                        });
                      }}
                      className="flex aspect-square items-center justify-center rounded-md border border-dashed h-[6rem]"
                    >
                      <PlusIcon />
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Subir imagen de producto</DrawerTitle>
                        <DrawerDescription>
                          <Card className="flex justify-center border-0">
                            <CardContent>
                              {imageTemplate.src != "" && (
                                <img
                                  alt="Product img"
                                  className="rounded-md object-cover min-h-[40vh] max-h-[60vh]"
                                  src={imageTemplate.src}
                                />
                              )}
                            </CardContent>
                          </Card>
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                        ></Input>
                        <div className="w-full flex justify-center space-x-8">
                          <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                          <DrawerClose
                            className={
                              imageTemplate.src === ""
                                ? "pointer-events-none"
                                : ""
                            }
                          >
                            <Button
                              disabled={imageTemplate.src === ""}
                              onClick={addToImages}
                              color="primary"
                            >
                              Agregar <ImagePlus />
                            </Button>
                          </DrawerClose>
                        </div>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-1">
            <CardHeader>
              <CardTitle>Precio</CardTitle>
              <CardDescription>
                Modifica el precio del producto antes de publicarlo en ASLAN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">SKU</TableHead>
                    <TableHead className="w-[20rem]">
                      Precio a Publicar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold flex-wrap">
                      {product.sku}
                    </TableCell>

                    <TableCell className="flex items-center gap-4 flex-1">
                      <Label htmlFor="price" className="sr-only">
                        Precio a Publicar
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        onChange={handleProductChange}
                        value={
                          productState.price === 0 ? "" : productState.price
                        }
                        className="w-full "
                      />
                      U$D
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Product</Button>
      </div>
    </div>
  );
}
