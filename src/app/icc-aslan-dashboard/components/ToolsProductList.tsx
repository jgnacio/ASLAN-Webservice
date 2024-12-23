import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Provider } from "@/domain/product/entities/Product";
import { Tooltip } from "@mui/material";
import { Button } from "@nextui-org/button";
import { Clipboard } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function ToolsProductList({
  title,
  partNumber,
  sku,
  price,
  provider,
}: {
  title: string;
  partNumber: string;
  sku: string;
  price: number;
  provider: Provider;
}) {
  const { toast } = useToast();
  const formatTitle = (title: string) => {
    return title
      .normalize("NFD") // Descompone caracteres con acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
      .replace(/[^a-zA-Z0-9\s]/g, "") // Elimina caracteres no alfanuméricos
      .replace(/\s+/g, " ") // Convierte múltiples espacios en uno solo
      .trim(); // Elimina espacios al inicio y al final
  };

  const handleSearchByProvider = () => {
    if (provider.name === "Unicom") {
      return `${provider.searchPageUrl}${encodeURI(sku)}`;
    }
    if (provider.name === "PCService") {
      const formattedTitle = formatTitle(title);
      return `${provider.searchPageUrl}${encodeURIComponent(
        formattedTitle
      )}&querypage=1`;
    }
    if (provider.name === "Solutionbox") {
      return `${provider.searchPageUrl}${encodeURI(title)}`;
    }
    return `${provider.searchPageUrl}${encodeURI(title)}`;
  };
  return (
    <div className="flex w-full h-full">
      <Tooltip
        className=""
        title={
          <div className="space-y-2 max-w-[250px]">
            <span>{title}</span>
            <Separator />
            <div className="flex justify-between">
              <p>
                SKU: <span className="text-yellow-400">{sku}</span>
              </p>
              <p className="text-yellow-400">{provider.name}</p>
            </div>
            <Separator />
            <div className="w-full flex h-10 justify-between items-center space-x-2 text-sm">
              <Tooltip title="Copiar Part Number">
                <Button isIconOnly color="secondary">
                  <Clipboard
                    onClick={() => {
                      navigator.clipboard.writeText(partNumber);
                      toast({
                        title: "Part Number copiado",
                        description:
                          "Se ha copiado el Part Number al portapapeles",
                      });
                    }}
                  />
                </Button>
              </Tooltip>
              <Separator orientation="vertical" />

              <Tooltip title="Buscar en Google">
                <a
                  target="_blank"
                  href={`https://www.google.com/search?q=${partNumber}`}
                >
                  <Button isIconOnly color="secondary">
                    <FaGoogle />
                  </Button>
                </a>
              </Tooltip>

              <Separator orientation="vertical" />
              <Tooltip title="Buscar en Aslan">
                <a
                  target="_blank"
                  href={`https://www.aslanstoreuy.com/?s=${partNumber}&post_type=product`}
                >
                  <Button isIconOnly color="secondary">
                    <img
                      src="https://res.cloudinary.com/dhq5ewbyu/image/upload/v1732105162/ASLAN/Logo/spnndbjvue1wefgbsib1.png"
                      alt="Aslan Logo"
                      width={30}
                    />
                  </Button>
                </a>
              </Tooltip>
              <Separator orientation="vertical" />

              <a target="_blank" href={handleSearchByProvider()}>
                <Tooltip title={`Buscar en ${provider.name}`}>
                  <Button isIconOnly color="secondary">
                    <img
                      src={provider.logoUrl}
                      alt={`${provider.name} Logo`}
                      width={30}
                    />
                  </Button>
                </Tooltip>
              </a>
            </div>
          </div>
        }
      >
        <span className=" w-full h-full">{title}</span>
      </Tooltip>
    </div>
  );
}
