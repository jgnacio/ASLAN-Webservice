import { logoPCService } from "./PC Service/adapters/PCServiceAPIProductAdapter";
import { solutionBoxProvider } from "./Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { logoUnicom } from "./Unicom/adapters/UnicomAPIProductAdapter";

export const ImplementProviders = [
  logoPCService,
  logoUnicom,
  solutionBoxProvider,
];
