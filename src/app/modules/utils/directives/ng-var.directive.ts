import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngVar]',
})
export class NgVarDirective {
  @Input()
  set ngVar(context: unknown) {
    this.context.$implicit = this.context.ngVar = context;

    if (!this.hasView) {
      this.vcRef.createEmbeddedView(this.templateRef, this.context);
      this.hasView = true;
    }
  }

  private context: {
    $implicit: unknown;
    ngVar: unknown;
  } = {
    $implicit: null,
    ngVar: null,
  };

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private vcRef: ViewContainerRef
  ) {}
}
