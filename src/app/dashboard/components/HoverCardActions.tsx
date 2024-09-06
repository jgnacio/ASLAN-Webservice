import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/button";
import { Building2, Clipboard, SearchIcon } from "lucide-react";

export default function HoverCardActions({ content }: { content: string }) {
  const { toast } = useToast();

  return (
    <HoverCard>
      <HoverCardTrigger
        onClick={() => {
          // copy to clipboard
          navigator.clipboard.writeText(content);
          toast({
            title: "Titulo copiado",
            description: "Se ha copiado el titulo al portapapeles",
          });
        }}
      >
        <div className="w-full h-full pointer-events-none">{content}</div>
      </HoverCardTrigger>
      <HoverCardContent className="z-10  w-40 p-2 overflow-hidden">
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
              href={`https://www.unicom.com.uy/Busqueda?SearchQuery=${content}`}
            >
              <Building2 />
            </a>
          </Button>
        </div>
        <div className="flex items-center pt-2">
          <span className="text-xs text-muted-foreground">{content}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
