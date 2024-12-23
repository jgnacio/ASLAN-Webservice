"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { createMarkup } from "@/lib/functions/HtmlInner";
import { CardContent } from "@mui/material";
import { Button } from "@nextui-org/button";
import { SquareArrowDownLeft, SquareArrowUpRight } from "lucide-react";
import { useState } from "react";
export default function ProductDetails({ product }: { product: any }) {
  const [isFloating, setIsFloating] = useState(false);
  const handleIsFloating = () => {
    setIsFloating(!isFloating);
  };
  return (
    <div className={` ${isFloating ? "absolute top-0 right-0 h-20 z-10" : ""}`}>
      {isFloating ? (
        <CardContent className="flex flex-col">
          <div className="self-end absolute">
            <Button
              onPress={handleIsFloating}
              color="secondary"
              className="opacity-50"
              isIconOnly
            >
              <SquareArrowDownLeft className="w-6 h-6" />
            </Button>
          </div>
          <div>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel></ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div
                  className="flex flex-col bg-background p-4"
                  dangerouslySetInnerHTML={createMarkup(product?.description)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </CardContent>
      ) : (
        <div className="flex flex-col">
          <div className="self-end absolute">
            <Button
              onPress={handleIsFloating}
              color="secondary"
              className="opacity-50"
              isIconOnly
            >
              <SquareArrowUpRight className="w-6 h-6" />
            </Button>
          </div>
          <div
            className="flex flex-col bg-background p-4"
            dangerouslySetInnerHTML={createMarkup(product?.description)}
          />
        </div>
      )}
    </div>
  );
}
