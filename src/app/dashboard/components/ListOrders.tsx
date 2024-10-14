import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WooOrder } from "@/Resources/API/ASLAN/entities/AslanWooAPI";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@nextui-org/spinner";

export default function ListOrders({ wooOrders }: { wooOrders: WooOrder[] }) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Ultimos Pedidos</CardTitle>
        <CardDescription>
          Lista de los últimos pedidos realizados en Aslan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {wooOrders ? (
          <ScrollArea className="h-72 rounded-xl border">
            <div className="p-4">
              {wooOrders.map((order) => (
                <>
                  <div key={order.id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>
                        {order.billing.first_name[0].toUpperCase()}
                        {order.billing.last_name
                          ? order.billing.last_name[0].toUpperCase()
                          : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {order.billing.first_name} {order.billing.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.billing.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-auto font-medium">
                      {order.status === "completed" && (
                        <>
                          <div className="text-success-500">
                            +${order.total}
                          </div>
                          <Badge variant="outlineSuccess">Completado</Badge>
                        </>
                      )}
                      {order.status === "processing" && (
                        <>
                          <div className="text-warning-500">${order.total}</div>
                          <Badge variant="outlineWarning">Procesando</Badge>
                        </>
                      )}
                      {order.status === "cancelled" && (
                        <>
                          <div className="text-destructive">${order.total}</div>
                          <Badge variant="outlineDestructive">Cancelado</Badge>
                        </>
                      )}

                      {order.status === "pending" && (
                        <>
                          <div className="text-warning-500">${order.total}</div>
                          <Badge variant="outlineWarning">Pendiente</Badge>
                        </>
                      )}
                      {order.status === "on-hold" && (
                        <>
                          <div className="text-warning-500">${order.total}</div>
                          <Badge variant="outlineWarning">En espera</Badge>
                        </>
                      )}

                      {order.status === "refunded" && (
                        <>
                          <div className="text-destructive">
                            -${order.total}
                          </div>
                          <Badge variant="outlineDestructive">
                            Reembolsado
                          </Badge>
                        </>
                      )}
                      {order.status === "failed" && (
                        <>
                          <div className="text-destructive">${order.total}</div>
                          <Badge variant="outlineDestructive">Fallido</Badge>
                        </>
                      )}
                      {order.status === "trash" && (
                        <>
                          <div className="text-muted">${order.total}</div>
                          <Badge variant="outline">Borrado</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Spinner size="lg" />
        )}
      </CardContent>
    </Card>
  );
}
