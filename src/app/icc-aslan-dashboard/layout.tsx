"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Layers,
  LayoutDashboard,
  LineChart,
  Package,
  Package2,
  PackagePlus,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un loader/skeleton mientras carga
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/icc-aslan-dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/icc-aslan-dashboard/products"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Productos</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Lista de Productos</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/icc-aslan-dashboard/cart"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Carrito</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Carrito</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/icc-aslan-dashboard/identify"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Layers className="h-5 w-5" />
                  <span className="sr-only">Identificar Productos</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Identificar Productos
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <span className="sr-only">Cuenta</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Cuenta</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Configuraciones</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configuraciones</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Alternar Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                {/* <SignedIn>
                  <UserButton showName />
                </SignedIn>
                <span className="sr-only">Cuenta</span> */}
                <SheetClose asChild>
                  <Link
                    href="/icc-aslan-dashboard"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground Hover:text-foreground"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/icc-aslan-dashboard/products"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground Hover:text-foreground"
                  >
                    <Package className="h-5 w-5" />
                    Productos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/icc-aslan-dashboard/cart"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground Hover:text-foreground"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Carrito
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem className="select-none">
                <BreadcrumbLink asChild>
                  <Link href="/icc-aslan-dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {pathname?.startsWith("/icc-aslan-dashboard/products") && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="select-none">
                    <BreadcrumbLink asChild>
                      <Link href="/icc-aslan-dashboard/products">
                        Productos
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}

              {pathname?.startsWith("/icc-aslan-dashboard/product") &&
                !pathname.endsWith("products") && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="select-none">
                      <BreadcrumbLink asChild>
                        <Link href="/icc-aslan-dashboard/products">
                          Productos
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="pointer-events-none select-none">
                      <BreadcrumbPage>{pathname.split("/")[3]}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}

              {pathname?.startsWith("/icc-aslan-dashboard/cart") && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="pointer-events-none select-none">
                    <BreadcrumbPage>Carrito</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid  items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-8  bg-gray-50">
          <div className="md:mx-auto min-w-[75vw] flex-1  gap-4 ">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
