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
import { Clipboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getProductAslanBySku } from "../../_actions/get-aslan-product-by-sku";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Badge } from "@/components/ui/badge";

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
                      className="text-sm border rounded-md h-36"
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
                          <span className="text-xs font-bold">{row.title}</span>
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
                              <span className="text-primary-400">
                                {relation.stock}
                              </span>
                            </span>
                            <span className="text-xs flex items-center gap-1">
                              <span className="font-semibold">Precio:</span>{" "}
                              {relation.price} U$D
                            </span>
                            <Badge
                              className=" absolute right-2 bottom-0"
                              variant={
                                relation.aslanInfo.status === "draft"
                                  ? "outlineDestructive"
                                  : "outlineSuccess"
                              }
                            >
                              {relation.aslanInfo.status === "draft"
                                ? "Borrador"
                                : "Publicado"}
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
