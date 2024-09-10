import { ProductAvailability } from "@/domain/product/entities/Product";
import { Ban, CircleCheckBig, MailQuestion } from "lucide-react";
import StatusIconGenerator from "./StatusIconGenerator";

// Icon and Color Map
const statusConfig = {
  in_stock: {
    name: "in_stock",
    icon: <CircleCheckBig />,
    color: "text-success-500",
    tooltip: "En stock",
  },
  out_of_stock: {
    name: "out_of_stock",
    icon: <Ban />,
    color: "text-danger-500",
    tooltip: "Sin stock",
  },
  on_demand: {
    name: "on_demand",
    icon: <MailQuestion />,
    color: "text-yellow-500",
    tooltip: "Consultar disponibilidad",
  },
} as const;

type StatusKeys = keyof typeof statusConfig;
interface StatusIconProps {
  stock: ProductAvailability;
}

export default function StockStatus({ stock }: StatusIconProps) {
  if (!(stock in statusConfig)) {
    console.warn(`Unknown stock status: ${stock}`);
    return null;
  }
  const status = statusConfig[stock as StatusKeys];

  if (!status) {
    console.warn(`Unknown stock status: ${stock}`);
    return null;
  }

  return (
    <StatusIconGenerator
      icons={Object.values(statusConfig)}
      status={{ name: stock, color: status.color, tooltip: status.tooltip }}
    />
  );
}
