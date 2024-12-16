"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CartProductType } from "@/domain/product/entities/Cart";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useMutation } from "@tanstack/react-query";
import { CircleX, Minus, PackageCheck, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import addToCart from "../_actions/add-product-to-cart";
import { eraseCart } from "../_actions/eraseCart";
import { getCart } from "../_actions/get-cart";
import { removeProductOnCart } from "../_actions/remove-product-on-cart";

export default function CartComponent() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any>([]);
  const router = useRouter();

  const {
    mutateAsync: server_getCart,
    isSuccess: isSuccessGetCart,
    data: dataCart,
    isPending: isLoadingGetCart,
    isError: isErrorGetCart,
  } = useMutation({
    mutationFn: () => getCart(),
  });

  const {
    mutateAsync: server_removeProductOnCart,
    isPending: isPendingRemoveProductOnCart,
    isSuccess: isSuccessRemoveProductOnCart,
  } = useMutation({
    mutationFn: ({ id }: { id: string }) => removeProductOnCart(id),
    onError: (error) => {
      toast({
        title: "Error",
        description: `Hubo un error al eliminar el producto del carrito: ${error.message}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Producto Eliminado",
        description: "El producto ha sido eliminado del carrito exitosamente.",
      });
    },
  });

  const {
    mutateAsync: server_eraseCart,
    isPending: isPendingEraseCart,
    isSuccess: isSuccessEraseCart,
  } = useMutation({
    mutationFn: () => eraseCart(),
  });

  const {
    mutate: server_addToCart,
    isPending: isPendingAddToCart,
    isSuccess: isSuccessAddToCart,
    isError: isErrorAddToCart,
  } = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      addToCart(id, quantity);
    },
    onSuccess: () => {
      toast({
        title: "Producto Agregado",
        description: "El producto ha sido agregado al carrito exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Hubo un error al agregar el producto al carrito: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddProduct = async (id: string, quantity: number) => {
    try {
      await server_addToCart({ id, quantity });
      await server_getCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      await server_removeProductOnCart({ id });
      await server_getCart();

      const newRows = rows.filter((row: any) => row.sku !== id);
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddQuantityToRow = async (id: string, quantity: number) => {
    const newRows = rows.map((row: any) => {
      if (row.id === id) {
        return { ...row, quantity: row.quantity + quantity };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleEraseCart = async () => {
    try {
      await server_eraseCart();
      toast({
        title: "Carrito Vacio",
        description: "El carrito ha sido vaciado exitosamente.",
        variant: "default",
      });
      setRows([]);
      getCart();
      if (dataCart) {
        dataCart.products = [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Producto",
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/icc-aslan-dashboard/product/${params.row.sku}`}>
          {params.row.title}
        </Link>
      ),
      flex: 1,
    },
    {
      field: "price",
      headerName: "Precio C/U",
      type: "number",
      width: 90,
      valueFormatter: (value, row) => `${row.price} U$D`,
    },
    // { field: "availability", headerName: "Disponibilidad", width: 120 },
    { field: "marca", headerName: "Marca", width: 120 },
    {
      field: "availability",
      headerName: "Disponibilidad",
      width: 120,
      valueGetter: (value, row) => {
        if (row.availability === "con_inventario") {
          return "En Stock";
        } else {
          return "Sin Stock";
        }
      },
    },
    { field: "sku", headerName: "SKU", width: 120 },
    {
      field: "priceByQuantity",
      headerName: "Total",
      type: "number",
      width: 90,
      valueGetter: (value, row) => `${row.price * row.quantity} U$D`,
    },
    {
      field: "addremove",
      headerName: "Cantidad",
      width: 120,
      type: "actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex justify-center items-center">
          <Button
            isIconOnly
            color="secondary"
            size="sm"
            onClick={() => {
              if (params.row.quantity <= 1) return;
              handleAddQuantityToRow(params.row.id, -1);
            }}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <span className="mx-4">{params.row.quantity}</span>
          <Button
            isIconOnly
            color="secondary"
            size="sm"
            onClick={() => {
              handleAddQuantityToRow(params.row.id, 1);
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      ),
    },

    {
      field: "update",
      headerName: "",
      type: "actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          color="secondary"
          onClick={() => {
            let actualQuantity = params.row.quantity;
            let previousQuantity = dataCart?.products.find(
              (product) => product.id === params.row.id
            )?.quantity;

            let isUpdateable =
              actualQuantity - (previousQuantity || 0) > 0 ||
              (previousQuantity || 0) > 0;

            console.log("result", actualQuantity - (previousQuantity || 0));

            if (isUpdateable) {
              handleAddProduct(
                params.row.sku,
                actualQuantity - (previousQuantity || 0)
              );
            }
            console.log("isUpdateable", isUpdateable);
          }}
        >
          Actualizar
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      type: "actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          isIconOnly
          color="danger"
          onClick={() => {
            handleRemoveProduct(params.row.sku);
          }}
        >
          <CircleX />
        </Button>
      ),
    },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) =>
    //     `${row.firstName || ""} ${row.lastName || ""}`,
    // },
  ];

  const handleSetRows = (products: CartProductType[]) => {
    const newRows = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        marca: product.marca,
        availability: product.available,
        quantity: product.quantity,
        guaranteeDays: product.guaranteeDays,
        sku: product.sku,
      };
    });
    setRows(newRows);
  };

  useEffect(() => {
    server_getCart();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carrito</CardTitle>
        <CardDescription>Listado de productos en el Carrito</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingGetCart ? <Spinner /> : ""}

        {dataCart && dataCart.products.length > 0 && (
          <div className="space-y-4">
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnSelector
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              autoHeight
              pageSizeOptions={[10, 20]}
            />
            <Button size="sm" color="secondary" onClick={handleEraseCart}>
              Vaciar Carrito <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
        {dataCart && dataCart.products.length <= 0 ? (
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-primary">
              No hay productos en el carrito
            </h3>
            <Link href="/icc-aslan-dashboard/products">
              <Button color="primary">Ver Productos</Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </CardContent>
      <CardFooter>
        {dataCart && dataCart.products.length > 0 && (
          <div className="flex justify-between w-full">
            <div>
              <h3 className="text-lg">
                Total incluyendo IVA:
                <span className="font-bold mx-2">
                  {dataCart.total_including_tax} U$D
                </span>
              </h3>
            </div>
            {/* TODO: Crear una boton para el toast de agregar carrito que te lleve al carrito y ver el producto que agregaste */}
            <div>
              <Link href="/icc-aslan-dashboard/purchase_order">
                <Button color="primary">
                  Confirmar <PackageCheck />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
