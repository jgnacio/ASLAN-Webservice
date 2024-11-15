"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Trash2 } from "lucide-react";
import { deleteProductRelation } from "../identify/_actions/delete-product-relation";

export default function ProductRelationConfig({
  SKU_Relation,
}: {
  SKU_Relation: string;
}) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: server_deleteProductRelation,
    isPending: isPendingDeleteProductRelation,
    isError: isErrorDeleteProductRelation,
    isSuccess: isSuccessDeleteProductRelation,
    data: dataDeleteProductRelation,
  } = useMutation({
    mutationFn: deleteProductRelation,
    onSuccess: () => {
      // Invalidar la clave de caché asociada a la lista de productos
      queryClient.invalidateQueries({
        queryKey: ["product-aslan-administrated-products"],
      });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-foreground-700" size={"icon"}>
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Configuración</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              server_deleteProductRelation(SKU_Relation);
            }}
          >
            <div className="flex gap-2 items-center ">
              <span>Eliminar</span>{" "}
              <Trash2 size={18} className="text-destructive" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
