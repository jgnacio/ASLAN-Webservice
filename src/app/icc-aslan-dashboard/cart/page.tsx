"use client";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import CartComponent from "./components/CartComponent";

export default function Cart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <CartComponent />
    </motion.div>
  );
}
