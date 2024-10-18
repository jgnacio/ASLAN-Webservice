"use client";
import { ProductType } from "@/domain/product/entities/Product";

import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import ListProductModular from "./ListProductModular";
import { getFeaturedProductsByPage } from "../_actions/get-featured-products";
import { useQuery } from "@tanstack/react-query";

export function ProductFeaturedList({ cart }: { cart: any }) {
  const { data: dataGetFeaturedProductsByPage } = useQuery({
    queryKey: ["getFeaturedProducts"],
    queryFn: () => getFeaturedProductsByPage({ page: 1 }),
  });

  return (
    <div className="w-full h-full">
      {!dataGetFeaturedProductsByPage ? (
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
          <ListProductModular
            productsRows={dataGetFeaturedProductsByPage}
            // cart={cart}
          />
        </motion.div>
      )}
    </div>
  );
}
