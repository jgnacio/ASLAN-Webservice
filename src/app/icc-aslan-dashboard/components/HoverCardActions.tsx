import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import { getUrlWP } from "@/lib/functions/getUrlWP";
import { Button } from "@nextui-org/button";
import {
  Building,
  Building2,
  Clipboard,
  Package,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";

export default function HoverCardActions({ content }: { content: string }) {
  const { toast } = useToast();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getUrlWP().then((res: any) => {
      setUrl(res);
    });
  }, []);

  return (
    <Tooltip
      title={
        <div>
          <div className="flex justify-between ">
            <Button isIconOnly variant="solid" color="secondary">
              <Clipboard
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  toast({
                    title: "Part Number copiado",
                    description: "Se ha copiado el Part Number al portapapeles",
                  });
                }}
              />
            </Button>
            <Button isIconOnly variant="solid" color="secondary">
              <a
                target="_blank"
                href={`https://www.google.com/search?q=${content}`}
              >
                <SearchIcon />
              </a>
            </Button>
            <Button isIconOnly variant="solid" color="secondary">
              <a
                target="_blank"
                href={`${url}/wp-admin/edit.php?s=${content}&post_status=all&post_type=product&action=-1&seo_filter&readability_filter&product_cat&product_type&stock_status&fb_sync_enabled&paged=1&action2=-1`}
              >
                <Building2 />
              </a>
            </Button>
            <Button isIconOnly variant="solid" color="secondary">
              <a
                target="_blank"
                href={`https://www.unicom.com.uy/Busqueda?SearchQuery=${content}`}
              >
                <Package />
              </a>
            </Button>
          </div>
          <div className="flex items-center pt-2 text-white">
            <span className="text-xs text-muted-foreground text-white ">
              {content}
            </span>
          </div>
        </div>
      }
      onClick={() => {
        // copy to clipboard
        navigator.clipboard.writeText(content);
        toast({
          title: "Titulo copiado",
          description: "Se ha copiado el titulo al portapapeles",
        });
      }}
    >
      <div>{content}</div>
    </Tooltip>
    // <HoverCard>
    //   <HoverCardTrigger
    //     onClick={() => {
    //       // copy to clipboard
    //       navigator.clipboard.writeText(content);
    //       toast({
    //         title: "Titulo copiado",
    //         description: "Se ha copiado el titulo al portapapeles",
    //       });
    //     }}
    //   >
    //     <div className="w-full h-full pointer-events-none text-sm flex items-center ">
    //       {content}
    //     </div>
    //   </HoverCardTrigger>
    //   <HoverCardContent className="-z-50  w-52 p-2 ">
    //     <div className="flex justify-between ">
    //       <Button isIconOnly variant="solid" color="secondary">
    //         <Clipboard
    //           onClick={() => {
    //             navigator.clipboard.writeText(content);
    //             toast({
    //               title: "Part Number copiado",
    //               description: "Se ha copiado el Part Number al portapapeles",
    //             });
    //           }}
    //         />
    //       </Button>
    //       <Button isIconOnly variant="solid" color="secondary">
    //         <a
    //           target="_blank"
    //           href={`https://www.google.com/search?q=${content}`}
    //         >
    //           <SearchIcon />
    //         </a>
    //       </Button>
    //       <Button isIconOnly variant="solid" color="secondary">
    //         <a
    //           target="_blank"
    //           href={`${url}/wp-admin/edit.php?s=${content}&post_status=all&post_type=product&action=-1&seo_filter&readability_filter&product_cat&product_type&stock_status&fb_sync_enabled&paged=1&action2=-1`}
    //         >
    //           <Building2 />
    //         </a>
    //       </Button>
    //       <Button isIconOnly variant="solid" color="secondary">
    //         <a
    //           target="_blank"
    //           href={`https://www.unicom.com.uy/Busqueda?SearchQuery=${content}`}
    //         >
    //           <Package />
    //         </a>
    //       </Button>
    //     </div>
    //     <div className="flex items-center pt-2">
    //       <span className="text-xs text-muted-foreground ">{content}</span>
    //     </div>
    //   </HoverCardContent>
    // </HoverCard>
  );
}
