"use client";
import { PlusIcon, Upload } from "lucide-react";

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
import { ProductType } from "@/domain/product/entities/Product";
import { useEffect, useState } from "react";
import ProductDescriptionEditor from "../edit/components/ProductDescriptionEditor";
import { useToast } from "@/components/ui/use-toast";

type imageProps = {
  name: string;
  src: string;
};

type imageListProps = imageProps[];

export function ProductEdit({ product }: { product: ProductType }) {
  const [imageTemplate, setImageTemplate] = useState<imageProps>({
    name: "",
    src: "",
  });
  const [file, setFile] = useState<imageListProps | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    console.log("file", file);
  }, [file]);
  function handleChange(e: any) {
    if (!file) {
      setImageTemplate({
        name: e.target.files[0].name,
        src: URL.createObjectURL(e.target.files[0]),
      });
      setFile([
        {
          name: e.target.files[0].name,
          src: URL.createObjectURL(e.target.files[0]),
        },
      ]);
      return;
    }
    // check first if there img allerady not exists on the file array
    const name = file.map((img) => {
      if (img.name === e.target.files[0].name) {
        toast({
          title: "Error",
          description: "La imagen ya fue cargada anteriormente.",
          variant: "destructive",
        });
        return img.name;
      }
    });

    if (name.includes(e.target.files[0].name)) {
      return;
    }

    const fileCopy = [...file];
    fileCopy.push({
      name: e.target.files[0].name,
      src: URL.createObjectURL(e.target.files[0]),
    });
    setImageTemplate({
      name: e.target.files[0].name,
      src: URL.createObjectURL(e.target.files[0]),
    });
    setFile(fileCopy);

    toast({
      title: "Imagen cargada",
      description: "La imagen fue cargada con éxito.",
      variant: "default",
    });
  }
  return (
    <div className="mx-auto grid max-w-[70vw] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Publicar Producto
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {product.stock > 0 ? <span>En stock</span> : <span>Sin stock</span>}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Descartar
          </Button>
          <Button size="sm">Publicar</Button>
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
                    contentPlainText={product.description}
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
                      <SelectItem value="published">Publico</SelectItem>
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
                      <img
                        alt="Product img"
                        src={img.src}
                        className="aspect-square items-center justify-center rounded-md border border-dashed h-[6rem]"
                      />
                    ))}
                  <Drawer>
                    <DrawerTrigger>
                      <Button
                        onClick={() => {
                          setImageTemplate({
                            name: "",
                            src: "",
                          });
                        }}
                        variant="outline"
                        className="flex aspect-square items-center justify-center rounded-md border border-dashed h-[6rem]"
                      >
                        <PlusIcon />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Subir imagen de producto</DrawerTitle>
                        <DrawerDescription>
                          <Card className="flex justify-center border-0">
                            <CardContent className={file ? "h-40 w-40" : ""}>
                              {imageTemplate.src != "" && (
                                <img
                                  alt="Product img"
                                  className="aspect-square w-full rounded-md object-cover"
                                  height="100"
                                  width="100"
                                  src={imageTemplate.src}
                                />
                              )}
                            </CardContent>
                          </Card>
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Input type="file" onChange={handleChange}></Input>
                        <DrawerClose>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
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
