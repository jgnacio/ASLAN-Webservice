"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clipboard, SquareArrowOutUpRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getProductAslanBySku } from "../../_actions/get-aslan-product-by-sku";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@mui/material";
import { ImplementProviders } from "@/Resources/API/config";

export default function ViewRelatedProducts({ row }: { row: any }) {
  const { toast } = useToast();
  const [productsWithAslanInfo, setProductsWithAslanInfo] = useState<any[]>([]);

  const {
    mutateAsync: server_getProductAslanBySku,
    isPending: isPendingProductAslanBySku,
    isSuccess: isSuccessProductAslanBySku,
    isError: isProductAslanBySkuError,
    data: dataProductAslanBySku,
  } = useMutation({
    mutationFn: (sku: string) => getProductAslanBySku(sku),
  });

  const handleSetFullProductInfo = async (sku: string) => {
    if (row.relations.length > 0) {
      try {
        const productsFullInfo = await Promise.all(
          row.relations.map(async (relation: any) => {
            try {
              const dataProductAslanBySku = await server_getProductAslanBySku(
                relation.SKU_Relation
              );
              return {
                ...relation,
                aslanInfo: dataProductAslanBySku,
              };
            } catch (error) {
              console.error(error);
              return {
                ...relation,
                aslanInfo: null,
              };
            }
          })
        );
        console.log("productsFullInfo", productsFullInfo);
        setProductsWithAslanInfo(productsFullInfo);
      } catch (error) {
        console.error("Error fetching full product info:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="border px-2 rounded-md h-9 flex items-center hover:bg-background transition-all"
          onClick={() => handleSetFullProductInfo(row.skuInterno)}
        >
          Ver {row.relations.length} relacionados
        </div>
      </DialogTrigger>
      <DialogContent className="w-full h-[80vh]">
        <DialogHeader>
          <DialogTitle>Productos Relacionados</DialogTitle>
          <DialogDescription className="w-full h-full">
            <ScrollArea className="h-full w-full rounded-md border">
              <div className="p-4">
                {isPendingProductAslanBySku ? (
                  <div className="text-center">
                    <Spinner />
                  </div>
                ) : (
                  productsWithAslanInfo &&
                  productsWithAslanInfo.length > 0 &&
                  productsWithAslanInfo.map((relation: any) => (
                    <div
                      key={relation.ID}
                      className="text-sm border rounded-md h-40"
                    >
                      <div className="grid grid-cols-3 gap-2 border-gray-200 h-full">
                        <img
                          className="w-full h-full"
                          src={
                            (relation.aslanInfo?.images.length > 0 &&
                              relation.aslanInfo?.images[0].src) ||
                            "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
                          }
                          alt={row.title}
                        ></img>
                        <div className="flex flex-col w-full h-full col-span-2 space-y-1 justify-center">
                          <span className="text-xs font-bold flex justify-between items-center pr-2">
                            {row.title}
                            <Tooltip
                              title={`Ver en ${relation.provider.name}`}
                              placement="top"
                            >
                              <a
                                target="_blank"
                                href={`${
                                  ImplementProviders.find(
                                    (provider) =>
                                      provider.name === relation.provider.name
                                  )?.searchPageUrl + relation.PartNumber
                                }`}
                              >
                                <SquareArrowOutUpRight
                                  size={20}
                                  className="text-primary-400 hover:text-primary-500 cursor-pointer"
                                />
                              </a>
                            </Tooltip>
                          </span>
                          <Separator />
                          <div className="flex flex-col relative">
                            <span className="text-xs flex items-center gap-1">
                              <span className="font-semibold">Proveedor:</span>{" "}
                              {relation.provider.name}
                            </span>
                            <span
                              className="text-xs flex items-center gap-1"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  relation.sku_provider
                                );
                                toast({
                                  title: `SKU de ${relation.provider.name} copiado`,
                                  description: (
                                    <p>
                                      Se ha copiado el SKU de{" "}
                                      <span className="font-bold text-primary-400">
                                        {relation.provider.name}
                                      </span>
                                    </p>
                                  ),
                                });
                              }}
                            >
                              <span className="font-semibold">SKU:</span>{" "}
                              {relation.sku_provider}
                              <Clipboard size={15} />
                            </span>
                            <span
                              className="text-xs flex items-center gap-1"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  relation.PartNumber
                                );
                                toast({
                                  title: "PartNumber copiado",
                                  description: "Se ha copiado el PartNumber",
                                });
                              }}
                            >
                              <span className="font-semibold">
                                Part Number:
                              </span>{" "}
                              {relation.PartNumber}
                              <Clipboard size={15} />
                            </span>
                            <span className="text-xs flex items-center gap-1">
                              <span className="font-semibold">Stock:</span>{" "}
                              <span
                                className={`${
                                  relation.stock > 0 && relation.stock < 5
                                    ? "text-warning-400"
                                    : relation.stock === 0
                                    ? "text-destructive-foreground"
                                    : "text-success-400"
                                }`}
                              >
                                {relation.stock}
                              </span>
                            </span>
                            <span className="text-xs flex items-center gap-1">
                              <span className="font-semibold">
                                Precio Proveedor:
                              </span>{" "}
                              {relation.price} U$D
                            </span>
                            <span className="text-xs flex items-center gap-1">
                              <span className="font-semibold">
                                Precio Publicado:
                              </span>{" "}
                              {relation.aslanInfo.price} U$D
                            </span>
                            <Badge
                              className={` absolute right-2 bottom-0 ${
                                relation.aslanInfo?.status
                                  ? ""
                                  : "text-muted-foreground"
                              } `}
                              variant={
                                relation.aslanInfo?.status
                                  ? relation.aslanInfo?.status === "draft"
                                    ? "outlineDestructive"
                                    : "outlineSuccess"
                                  : "outline"
                              }
                            >
                              {relation.aslanInfo?.status
                                ? relation.aslanInfo?.status === "draft"
                                  ? "Borrador"
                                  : "Publicado"
                                : "Sin Info"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
