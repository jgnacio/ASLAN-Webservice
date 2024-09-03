"use client";
import { ImagePlus, PlusIcon } from "lucide-react";

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

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { publishProduct } from "../_actions/publish-product";
import { motion } from "framer-motion";
import ProductDescriptionEditor from "../edit/components/ProductDescriptionEditor";
type imageProps = {
  name: string;
  src: string;
  content: File | null;
  type: string;
  filename: string;
};

type imageListProps = imageProps[];

export function ProductEdit({ product }: { product: ProductType }) {
  const [imageTemplate, setImageTemplate] = useState<imageProps>({
    name: "",
    src: "",
    content: null,
    type: "",
    filename: "",
  });
  const [file, setFile] = useState<imageListProps | null>(null);
  const [contentDescripcion, serContentDescripcion] = useState<string>(
    product.description
  );

  const [productState, setProductState] = useState<ProductType>(product);

  const router = useRouter();
  const { toast } = useToast();

  const {
    mutateAsync: server_publishProduct,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: (product: ProductType) => publishProduct(product),
    onSuccess: () => {
      toast({
        title: "Producto publicado",
        description: "El producto fue publicado con éxito.",
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

  // const {
  //   mutateAsync: server_createMedia,
  //   isError: mediaIsError,
  //   isSuccess: mediaIsSuccess,
  // } = useMutation({
  //   mutationFn: (data: { content: File; title: string }) => createMedia(data),
  //   onSuccess: () => {
  //     toast({
  //       title: "Imagen subida",
  //       description: "La imagen fue subida con éxito.",
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: "Hubo un error al subir la imagen.",
  //       variant: "destructive",
  //     });
  //   },
  // });

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
    (number | null)[] | undefined
  > {
    if (file) {
      const ids: any[] = [];
      for (let i = 0; i < file.length; i++) {
        const img = file[i];
        try {
          const id = await SubmitImageToProduction(img.name);
          if (!id) {
            ids.push(null);
          } else {
            ids.push(id);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: `Hubo un error al subir la imagen ${img.filename}.`,
            variant: "destructive",
          });
          break; // Detiene el bucle si ocurre un error
        }
      }

      if (ids.includes(null)) {
        return undefined;
      }

      if (!ids) {
        return undefined;
      }

      return ids;
    }
  }

  async function handleSubmmit() {
    // TODO: accepct the product image as object

    try {
      const ids = await submitImagesToProduction();
      if (!ids) {
        return;
      }

      product.images = ids;
      server_publishProduct(product);
    } catch (error) {
      return;
    }
  }

  return (
    <div className="mx-auto grid max-w-[70vw] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Publicar Producto
        </h1>
        <Badge
          variant={product.stock > 0 ? "default" : "destructive"}
          className="ml-auto sm:ml-0"
        >
          {product.stock > 0 ? <span>En stock</span> : <span>Sin stock</span>}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button
            onClick={() => router.push("/dashboard/products")}
            variant="outline"
            size="sm"
          >
            Descartar
          </Button>
          <Button size="sm" onClick={handleSubmmit}>
            Publicar
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
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    defaultValue={product.title}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Descripción</Label>
                  <ProductDescriptionEditor
                    contentPlainText={contentDescripcion}
                    setContentPlainText={serContentDescripcion}
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
                  <Label htmlFor="status">Estado</Label>
                  <Select>
                    <SelectTrigger
                      id="status"
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
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Precio a Publicar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">
                      {product.sku}
                    </TableCell>

                    <TableCell className="flex items-center gap-4">
                      <Label htmlFor="price-1" className="sr-only">
                        Precio a Publicar
                      </Label>
                      <Input
                        id="price-1"
                        type="number"
                        onChange={(e) => {
                          product.price = Number(e.target.value);
                        }}
                        defaultValue={product.price || ""}
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
