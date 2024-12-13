import { Provider } from "@/domain/product/entities/Product";
import { logoPCService } from "./PC Service/adapters/PCServiceAPIProductAdapter";
import { solutionBoxProvider } from "./Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { logoUnicom } from "./Unicom/adapters/UnicomAPIProductAdapter";

export const CDRProvider: Provider = {
  name: "CDR",
  mainPageUrl: "https://www.cdrmedios.com/",
  searchPageUrl: "https://www.cdrmedios.com/productos/?secc=productos&buscar=",
  logoUrl:
    "https://www.cdrmedios.com/artworks/artworks_cdrmedios2020com/logo.svg",
};
export const IntcomexProvider: Provider = {
  name: "Intcomex",
  mainPageUrl: "https://store.intcomex.com/es-xuy",
  searchPageUrl:
    "https://store.intcomex.com/es-xuy/Products/ByKeyword?typeSearch=&r=true&term=",
  logoUrl: "https://store.intcomex.com/Content/Images/Layout/Logo.png",
};

export const ImplementProviders = [
  logoPCService,
  logoUnicom,
  solutionBoxProvider,
  CDRProvider,
  IntcomexProvider,
];
