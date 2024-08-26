"use client";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import ResentSales from "./components/ResentSales";
import { Button } from "@nextui-org/button";
import AslanTestWoocomerce from "@/Resources/API/ASLAN/AslanTestWoocomerce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@nextui-org/spinner";
import { Badge } from "@nextui-org/react";
import { Check, Dot } from "lucide-react";

export default function Dashboard() {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { toast } = useToast();

  const { isSuccess, isLoading, isError } = useQuery({
    queryKey: ["aslan-woocomerce"],
    queryFn: () => AslanTestWoocomerce(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <span className="flex justify-end items-center space-x-2">
        Conexión a API ASLAN Woocommerce. Status:{" "}
        {isLoading ? (
          <Spinner size="sm" className="h-12 w-12" />
        ) : isSuccess ? (
          <motion.div
            className="h-12 w-12"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Dot className="h-12 w-12 text-success-400" />
          </motion.div>
        ) : isError ? (
          <motion.div
            className="h-12 w-12"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Dot className="h-12 w-12 text-danger-400" />
          </motion.div>
        ) : (
          <motion.div
            className="h-12 w-12"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Dot className="h-12 w-12 text-danger-400" />
          </motion.div>
        )}
      </span>
      <ResentSales />
    </motion.div>
  );
}
