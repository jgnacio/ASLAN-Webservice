import { CDRMediosAPIProductAdapter } from "../../CDRMedios/adapters/CDRMediosAPIProductAdapter";
import { PCServiceAPIProductAdapter } from "../../PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "../../Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "../../Unicom/adapters/UnicomAPIProductAdapter";

export class APIsAdapterSingleton {
  private static instances: Record<string, any> = {};

  public static getAdapter(provider: string): any {
    if (!this.instances[provider]) {
      switch (provider) {
        case "Unicom":
          this.instances[provider] = new UnicomAPIProductAdapter();
          break;
        case "PCService":
          this.instances[provider] = new PCServiceAPIProductAdapter();
          break;
        case "Solutionbox":
          this.instances[provider] = new SolutionboxAPIProductAdapter();
          break;
        case "CDR":
          this.instances[provider] = new CDRMediosAPIProductAdapter();
          break;
        case "Intcomex":
          this.instances[provider] = new CDRMediosAPIProductAdapter();
          break;
        default:
          throw new Error(`Adapter for provider "${provider}" not found`);
      }
    }
    return this.instances[provider];
  }
}
