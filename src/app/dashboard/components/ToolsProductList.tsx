import { Button } from "@nextui-org/button";
import HoverCardActions from "./HoverCardActions";
import { Building2, Clipboard, Package, SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Provider } from "@/domain/product/entities/Product";
import { Tooltip } from "@mui/material";
import { Separator } from "@/components/ui/separator";

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
  return (
    <div className="flex w-full h-full">
      <Tooltip
        title={
          <div className="space-y-1">
            <span>SKU: {sku}</span>
            <Separator />
            <span>Provider: {provider.name}</span>
            <Separator />
            <div className="flex h-10 items-center space-x-2 text-sm">
              <Button isIconOnly variant="bordered" color="secondary">
                <Clipboard
                  onClick={() => {
                    navigator.clipboard.writeText(title);
                    toast({
                      title: "Part Number copiado",
                      description:
                        "Se ha copiado el Part Number al portapapeles",
                    });
                  }}
                />
              </Button>
              <Separator orientation="vertical" />

              <Button isIconOnly variant="bordered" color="secondary">
                <a
                  target="_blank"
                  href={`https://www.google.com/search?q=${sku}`}
                >
                  <SearchIcon />
                </a>
              </Button>
              <Separator orientation="vertical" />

              <Button isIconOnly variant="bordered" color="secondary">
                {/* <a
                        target="_blank"
                        href={`${url}/wp-admin/edit.php?s=${title}&post_status=all&post_type=product&action=-1&seo_filter&readability_filter&product_cat&product_type&stock_status&fb_sync_enabled&paged=1&action2=-1`}
                      > */}
                <Building2 />
                {/* </a> */}
              </Button>
              <Separator orientation="vertical" />

              <Button isIconOnly variant="bordered" color="secondary">
                <a
                  target="_blank"
                  href={`${provider.searchPageUrl}${encodeURI(sku)}`}
                >
                  <Package />
                </a>
              </Button>
            </div>
          </div>
          // <div className="">
          //   <div className="flex justify-between ">
          //     <Button isIconOnly variant="solid" color="secondary">
          //       <Clipboard
          //         onClick={() => {
          //           navigator.clipboard.writeText(title);
          //           toast({
          //             title: "Part Number copiado",
          //             description:
          //               "Se ha copiado el Part Number al portapapeles",
          //           });
          //         }}
          //       />
          //     </Button>
          //     <Button isIconOnly variant="solid" color="secondary">
          //       <a
          //         target="_blank"
          //         href={`https://www.google.com/search?q=${title}`}
          //       >
          //         <SearchIcon />
          //       </a>
          //     </Button>
          //     <Button isIconOnly variant="solid" color="secondary">
          //       {/* <a
          //             target="_blank"
          //             href={`${url}/wp-admin/edit.php?s=${title}&post_status=all&post_type=product&action=-1&seo_filter&readability_filter&product_cat&product_type&stock_status&fb_sync_enabled&paged=1&action2=-1`}
          //           > */}
          //       <Building2 />
          //       {/* </a> */}
          //     </Button>
          //     <Button isIconOnly variant="solid" color="secondary">
          //       <a
          //         target="_blank"
          //         href={`${provider.searchPageUrl}${encodeURI(title)}`}
          //       >
          //         <Package />
          //       </a>
          //     </Button>
          //   </div>
          //   <div className="flex items-center pt-2 text-white">
          //     <span className="text-xs text-muted-foreground text-white ">
          //       {title}
          //     </span>
          //   </div>
          // </div>
        }
      >
        <span className=" w-full h-full">{title}</span>
      </Tooltip>
    </div>
  );
}
