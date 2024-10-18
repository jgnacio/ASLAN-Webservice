"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";
import { defaultUnicomAPIRelevantCategories } from "@/Resources/API/Unicom/UnicomAPIRequets";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import { getRelevantProducts } from "../_actions/get-relevant-products";

import ListProductModular from "./ListProductModular";

export default function ProductRelevantList({ cart }: { cart: any }) {
  const [category, setCategory] = useState<UnicomAPICategory>(
    defaultUnicomAPIRelevantCategories[0]
  );

  const {
    mutateAsync: server_getRelevantProducts,
    isPending: isLoadingGetProductsByPage,
    data: relevantProducts,
  } = useMutation({
    mutationFn: ({
      page,
      category,
    }: {
      page: number;
      category: UnicomAPICategory;
    }) => getRelevantProducts({ page, category }),
  });

  const handleSearchCategory = async () => {
    await server_getRelevantProducts({
      page: 1,
      category: category,
    });
  };

  return (
    <div className="w-full h-full ">
      <div className="flex space-x-2 h-16 -mt-16 items-center w-full justify-end">
        <Select
          defaultValue="Notebooks"
          onValueChange={(value) => {
            const category = defaultUnicomAPIRelevantCategories.find(
              (category) => category.name === value
            );
            if (category) {
              setCategory(category);
              console.log("category", category);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categorias</SelectLabel>
              {defaultUnicomAPIRelevantCategories.map((category, index) => (
                <SelectItem value={category.name} key={category.code + index}>
                  {category.nameES}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" />
        <Button color="primary" onClick={handleSearchCategory}>
          Buscar
        </Button>
      </div>

      {isLoadingGetProductsByPage ? (
        <div className="flex justify-center items-center h-[200px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Spinner color="primary" />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!relevantProducts ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, easings: "easeInOut" }}
              className="flex justify-center items-center h-[200px]"
            >
              <p className="font-semibold">Realiza una busqueda!</p>
            </motion.div>
          ) : (
            <ListProductModular productsRows={relevantProducts} cart={cart} />
          )}
        </motion.div>
      )}
    </div>
  );
}
