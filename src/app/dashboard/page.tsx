"use client";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import ResentSales from "./components/ResentSales";

export default function Dashboard() {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
    >
      <ResentSales />
    </motion.div>
  );
}
