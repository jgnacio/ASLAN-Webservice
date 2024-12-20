import { CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CardContent } from "@mui/material";
import { Card, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { getAllProductCached } from "../_actions/get-all-product-cached";
import ListProductModular from "./ListProductModular";

export default function ProductSearchEngine() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
