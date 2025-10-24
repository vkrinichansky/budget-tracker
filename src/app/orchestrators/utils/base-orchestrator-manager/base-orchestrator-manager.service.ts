import { BaseOrchestratorService } from '../base-orchestrator/base-orchestrator.service';

export abstract class BaseOrchestratorManager {
  protected abstract orchestrators: BaseOrchestratorService[];

  init(): void {
    this.orchestrators.forEach((orchestrator) => {
      orchestrator.listen();
    });
  }

  destroyAll(): void {
    this.orchestrators.forEach((orchestrator) => {
      orchestrator.destroy();
    });
  }
}
