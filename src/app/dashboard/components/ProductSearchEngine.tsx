import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@mui/material";
import { Card, CardHeader } from "@nextui-org/card";
import {
  Minus,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { DefaultCategoriesAdapter } from "@/domain/categories/defaultCategories";
import { ImplementProviders } from "@/Resources/API/config";
import { ChangeEventHandler, useEffect, useState } from "react";
import ListProductModular from "./ListProductModular";
import { useQuery } from "@tanstack/react-query";
import { getAllProductCached } from "../_actions/get-all-product-cached";
import { getProductCachedByProvider } from "../_actions/get-products-cached-by-provider";
import { ProductType } from "@/domain/product/entities/Product";
import { Spinner } from "@nextui-org/spinner";

export default function ProductSearchEngine() {
  const [search, setSearch] = useState("");
  const [filtersBuffer, setFiltersBuffer] = useState({
    category: "",
    provider: "",
  });

  const [filters, setFilters] = useState({
    category: "",
    provider: "",
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSetFilters = () => {
    setFilters(filtersBuffer);
  };

  const {
    data: cachedProducts,
    isLoading: isLoadingCachedProducts,
    isError: isErrorCachedProducts,
    error: errorCachedProducts,
  } = useQuery({
    queryKey: ["cachedProducts-by-provider"],
    queryFn: () => getAllProductCached(),
  });

  return !isLoadingCachedProducts ? (
    <Card className=" shadow-sm">
      <CardHeader className="flex  items-center space-x-4 pb-0">
        <div className="relative flex items-center justify-center">
          <Search className="absolute left-6  w-[20px] text-tertiary " />
          <Input
            placeholder="Buscar"
            className="px-14 w-[255px] placeholder:text-primary bg-background"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div>
          {/* <Drawer>
            <DrawerTrigger>
              <div className="border p-[6px] rounded-md">
                <SlidersHorizontal />
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Filtrado de Productos</DrawerTitle>
                  <DrawerDescription>
                    Busca los productos de manera más precisa
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">
                    <Select
                      onValueChange={(value) => {
                        setFiltersBuffer({ ...filtersBuffer, category: value });
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorias</SelectLabel>
                          {DefaultCategoriesAdapter.map((category) => (
                            <SelectItem
                              key={category.code}
                              value={category.code}
                            >
                              {category.nameES}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => {
                        setFiltersBuffer({ ...filtersBuffer, provider: value });
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Proveedor</SelectLabel>
                          {ImplementProviders.map((provider) => (
                            <SelectItem
                              key={provider.name}
                              value={provider.name}
                            >
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-3 h-[120px]">
                    <div className="w-full h-full bg-muted border rounded-md flex flex-col justify-center items-center">
                      <Settings2 className="text-foreground-500" />
                      <span className="text-center text-xs text-foreground-400">
                        Filtros para los productos en la Base de Datos de Aslan
                        <br />
                        <span className="text-foreground-400">
                          ¡Propón filtros!
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button onClick={handleSetFilters}>Filtrar</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer> */}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="self-end text-foreground-300 absolute top-0 right-4">
          Productos obtenidos en la base de datos de Aslan
        </CardDescription>
        <ListProductModular
          productsRows={
            cachedProducts?.filter((product) => {
              const partNumber = (product.partNumber as any) || "";
              const provider = product.provider || null;
              return (
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.sku.toLowerCase().includes(search.toLowerCase()) ||
                partNumber.includes(search) ||
                provider?.name.toLowerCase().includes(search.toLowerCase())
              );
            }) || []
          }
        />
      </CardContent>
    </Card>
  ) : (
    <Spinner size="lg" />
  );
}
