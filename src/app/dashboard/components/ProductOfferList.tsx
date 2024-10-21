"use client";
import { ProductType } from "@/domain/product/entities/Product";

import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";
import ListProductModular from "./ListProductModular";
import { useMutation } from "@tanstack/react-query";
import { getOffersProductsByPage } from "../_actions/get-offer-products";
import { useEffect } from "react";

export default function ProductOfferList({ cart }: { cart?: any }) {
  const {
    mutateAsync: server_getOfferProducts,
    data: dataGetOfferProducts,
    isPending: isPendingDataGetOfferProducts,
  } = useMutation({
    mutationFn: () => getOffersProductsByPage({ page: 1 }),
  });

  useEffect(() => {
    server_getOfferProducts();
  }, []);

  return (
    <div className="w-full h-full">
      {isPendingDataGetOfferProducts ? (
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
          <ListProductModular productsRows={dataGetOfferProducts} cart={cart} />
        </motion.div>
      )}
    </div>
  );
}
