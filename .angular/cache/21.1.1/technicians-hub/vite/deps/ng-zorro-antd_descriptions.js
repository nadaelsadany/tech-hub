import {
  NzBreakpointEnum,
  NzBreakpointService,
  gridResponsiveMap
} from "./chunk-LTR7ZACI.js";
import "./chunk-QYDDKLT3.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-ZRDBGOGI.js";
import "./chunk-EFZYVAM5.js";
import {
  NzConfigService,
  WithConfig
} from "./chunk-5TEZHPCR.js";
import {
  takeUntilDestroyed
} from "./chunk-RIV7STQV.js";
import {
  warn
} from "./chunk-6YEP226A.js";
import "./chunk-QE5DRVFI.js";
import "./chunk-JRIK2776.js";
import "./chunk-EPNRU4TG.js";
import {
  Directionality
} from "./chunk-BTAEODP3.js";
import {
  NgTemplateOutlet
} from "./chunk-DGGTYZBC.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  Input,
  NgModule,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomTemplate,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-KHOA27O3.js";
import "./chunk-SR2LXFJL.js";
import {
  merge
} from "./chunk-V37RSN4D.js";
import {
  Subject,
  __esDecorate,
  __runInitializers,
  auditTime,
  startWith,
  switchMap,
  tap
} from "./chunk-VUVMRRXW.js";
import "./chunk-GOMI4DH3.js";

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-descriptions.mjs
var _c0 = ["*"];
function NzDescriptionsItemComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function NzDescriptionsComponent_Conditional_0_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzTitle);
  }
}
function NzDescriptionsComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtemplate(1, NzDescriptionsComponent_Conditional_0_Conditional_1_ng_container_1_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzTitle);
  }
}
function NzDescriptionsComponent_Conditional_0_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzExtra);
  }
}
function NzDescriptionsComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, NzDescriptionsComponent_Conditional_0_Conditional_2_ng_container_1_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzExtra);
  }
}
function NzDescriptionsComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵconditionalCreate(1, NzDescriptionsComponent_Conditional_0_Conditional_1_Template, 2, 1, "div", 2);
    ɵɵconditionalCreate(2, NzDescriptionsComponent_Conditional_0_Conditional_2_Template, 2, 1, "div", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzTitle ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.nzExtra ? 2 : -1);
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext(2).$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r2.title, " ");
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_ng_template_5_Template(rf, ctx) {
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 6)(1, "div", 7)(2, "span", 8);
    ɵɵtemplate(3, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_ng_container_3_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd();
    ɵɵelementStart(4, "span", 9);
    ɵɵtemplate(5, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_ng_template_5_Template, 0, 0, "ng-template", 10);
    ɵɵelementEnd()()();
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext().$implicit;
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵproperty("colSpan", item_r2.span);
    ɵɵadvance(2);
    ɵɵclassProp("ant-descriptions-item-no-colon", !ctx_r0.nzColon);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", item_r2.title);
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", item_r2.content);
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext(2).$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r2.title, " ");
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_ng_template_3_Template(rf, ctx) {
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 8);
    ɵɵtemplate(1, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_ng_container_1_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd();
    ɵɵelementStart(2, "td", 11);
    ɵɵtemplate(3, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_ng_template_3_Template, 0, 0, "ng-template", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r2 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", item_r2.title);
    ɵɵadvance();
    ɵɵproperty("colSpan", item_r2.span * 2 - 1);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", item_r2.content);
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_0_Template, 6, 5, "td", 6)(1, NzDescriptionsComponent_Conditional_4_For_1_For_2_Conditional_1_Template, 4, 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵconditional(!ctx_r0.nzBordered ? 0 : 1);
  }
}
function NzDescriptionsComponent_Conditional_4_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "tr", 5);
    ɵɵrepeaterCreate(1, NzDescriptionsComponent_Conditional_4_For_1_For_2_Template, 2, 1, null, null, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    ɵɵadvance();
    ɵɵrepeater(row_r3);
  }
}
function NzDescriptionsComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzDescriptionsComponent_Conditional_4_For_1_Template, 3, 0, "tr", 5, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵrepeater(ctx_r0.itemMatrix);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_2_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r4 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r4.title, " ");
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 6)(1, "div", 7)(2, "span", 8);
    ɵɵtemplate(3, NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_2_ng_container_3_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd()()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r0 = ɵɵnextContext(4);
    ɵɵproperty("colSpan", item_r4.span);
    ɵɵadvance(2);
    ɵɵclassProp("ant-descriptions-item-no-colon", !ctx_r0.nzColon);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", item_r4.title);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_5_ng_template_3_Template(rf, ctx) {
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 6)(1, "div", 7)(2, "span", 9);
    ɵɵtemplate(3, NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_5_ng_template_3_Template, 0, 0, "ng-template", 10);
    ɵɵelementEnd()()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    ɵɵproperty("colSpan", item_r5.span);
    ɵɵadvance(3);
    ɵɵproperty("ngTemplateOutlet", item_r5.content);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "tr", 5);
    ɵɵrepeaterCreate(1, NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_2_Template, 4, 4, "td", 6, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
    ɵɵelementStart(3, "tr", 5);
    ɵɵrepeaterCreate(4, NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_For_5_Template, 4, 2, "td", 6, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const row_r6 = ctx.$implicit;
    ɵɵadvance();
    ɵɵrepeater(row_r6);
    ɵɵadvance(3);
    ɵɵrepeater(row_r6);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzDescriptionsComponent_Conditional_5_Conditional_0_For_1_Template, 6, 0, null, null, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵrepeater(ctx_r0.itemMatrix);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r7 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r7.title, " ");
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 12);
    ɵɵtemplate(1, NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_2_ng_container_1_Template, 2, 1, "ng-container", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    ɵɵproperty("colSpan", item_r7.span);
    ɵɵadvance();
    ɵɵproperty("nzStringTemplateOutlet", item_r7.title);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_5_ng_template_1_Template(rf, ctx) {
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "td", 11);
    ɵɵtemplate(1, NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_5_ng_template_1_Template, 0, 0, "ng-template", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    ɵɵproperty("colSpan", item_r8.span);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", item_r8.content);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "tr", 5);
    ɵɵrepeaterCreate(1, NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_2_Template, 2, 2, "td", 12, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
    ɵɵelementStart(3, "tr", 5);
    ɵɵrepeaterCreate(4, NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_For_5_Template, 2, 2, "td", 11, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    ɵɵadvance();
    ɵɵrepeater(row_r9);
    ɵɵadvance(3);
    ɵɵrepeater(row_r9);
  }
}
function NzDescriptionsComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzDescriptionsComponent_Conditional_5_Conditional_1_For_1_Template, 6, 0, null, null, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵrepeater(ctx_r0.itemMatrix);
  }
}
function NzDescriptionsComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzDescriptionsComponent_Conditional_5_Conditional_0_Template, 2, 0)(1, NzDescriptionsComponent_Conditional_5_Conditional_1_Template, 2, 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(!ctx_r0.nzBordered ? 0 : 1);
  }
}
var NzDescriptionsItemComponent = class _NzDescriptionsItemComponent {
  content;
  nzSpan = 1;
  nzTitle = "";
  inputChange$ = new Subject();
  ngOnChanges() {
    this.inputChange$.next();
  }
  ngOnDestroy() {
    this.inputChange$.complete();
  }
  static ɵfac = function NzDescriptionsItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzDescriptionsItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzDescriptionsItemComponent,
    selectors: [["nz-descriptions-item"]],
    viewQuery: function NzDescriptionsItemComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(TemplateRef, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.content = _t.first);
      }
    },
    inputs: {
      nzSpan: [2, "nzSpan", "nzSpan", numberAttribute],
      nzTitle: "nzTitle"
    },
    exportAs: ["nzDescriptionsItem"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzDescriptionsItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomTemplate(0, NzDescriptionsItemComponent_ng_template_0_Template, 1, 0, "ng-template");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzDescriptionsItemComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-descriptions-item",
      template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
      exportAs: "nzDescriptionsItem"
    }]
  }], null, {
    content: [{
      type: ViewChild,
      args: [TemplateRef, {
        static: true
      }]
    }],
    nzSpan: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzTitle: [{
      type: Input
    }]
  });
})();
var NZ_CONFIG_MODULE_NAME = "descriptions";
var defaultColumnMap = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
var NzDescriptionsComponent = (() => {
  let _nzBordered_decorators;
  let _nzBordered_initializers = [];
  let _nzBordered_extraInitializers = [];
  let _nzColumn_decorators;
  let _nzColumn_initializers = [];
  let _nzColumn_extraInitializers = [];
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  let _nzColon_decorators;
  let _nzColon_initializers = [];
  let _nzColon_extraInitializers = [];
  return class NzDescriptionsComponent2 {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _nzBordered_decorators = [WithConfig()];
      _nzColumn_decorators = [WithConfig()];
      _nzSize_decorators = [WithConfig()];
      _nzColon_decorators = [WithConfig()];
      __esDecorate(null, null, _nzBordered_decorators, {
        kind: "field",
        name: "nzBordered",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzBordered" in obj,
          get: (obj) => obj.nzBordered,
          set: (obj, value) => {
            obj.nzBordered = value;
          }
        },
        metadata: _metadata
      }, _nzBordered_initializers, _nzBordered_extraInitializers);
      __esDecorate(null, null, _nzColumn_decorators, {
        kind: "field",
        name: "nzColumn",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzColumn" in obj,
          get: (obj) => obj.nzColumn,
          set: (obj, value) => {
            obj.nzColumn = value;
          }
        },
        metadata: _metadata
      }, _nzColumn_initializers, _nzColumn_extraInitializers);
      __esDecorate(null, null, _nzSize_decorators, {
        kind: "field",
        name: "nzSize",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzSize" in obj,
          get: (obj) => obj.nzSize,
          set: (obj, value) => {
            obj.nzSize = value;
          }
        },
        metadata: _metadata
      }, _nzSize_initializers, _nzSize_extraInitializers);
      __esDecorate(null, null, _nzColon_decorators, {
        kind: "field",
        name: "nzColon",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzColon" in obj,
          get: (obj) => obj.nzColon,
          set: (obj, value) => {
            obj.nzColon = value;
          }
        },
        metadata: _metadata
      }, _nzColon_initializers, _nzColon_extraInitializers);
      if (_metadata) Object.defineProperty(this, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    }
    nzConfigService = inject(NzConfigService);
    cdr = inject(ChangeDetectorRef);
    breakpointService = inject(NzBreakpointService);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    items;
    nzBordered = __runInitializers(this, _nzBordered_initializers, false);
    nzLayout = (__runInitializers(this, _nzBordered_extraInitializers), "horizontal");
    nzColumn = __runInitializers(this, _nzColumn_initializers, defaultColumnMap);
    nzSize = (__runInitializers(this, _nzColumn_extraInitializers), __runInitializers(this, _nzSize_initializers, "default"));
    nzTitle = (__runInitializers(this, _nzSize_extraInitializers), "");
    nzExtra;
    nzColon = __runInitializers(this, _nzColon_initializers, true);
    itemMatrix = (__runInitializers(this, _nzColon_extraInitializers), []);
    realColumn = 3;
    dir = "ltr";
    breakpoint = NzBreakpointEnum.md;
    ngOnInit() {
      this.dir = this.directionality.value;
      this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
        this.dir = direction;
      });
    }
    ngOnChanges(changes) {
      if (changes.nzColumn) {
        this.prepareMatrix();
      }
    }
    ngAfterContentInit() {
      const contentChange$ = this.items.changes.pipe(startWith(this.items));
      merge(contentChange$, contentChange$.pipe(switchMap(() => merge(...this.items.map((i) => i.inputChange$)).pipe(auditTime(16)))), this.breakpointService.subscribe(gridResponsiveMap).pipe(tap((bp) => this.breakpoint = bp))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.prepareMatrix();
        this.cdr.markForCheck();
      });
    }
    /**
     * Prepare the render matrix according to description items' spans.
     */
    prepareMatrix() {
      if (!this.items) {
        return;
      }
      let currentRow = [];
      let width = 0;
      const column = this.realColumn = this.getColumn();
      const items = this.items.toArray();
      const length = items.length;
      const matrix = [];
      const flushRow = () => {
        matrix.push(currentRow);
        currentRow = [];
        width = 0;
      };
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const {
          nzTitle: title,
          content,
          nzSpan: span
        } = item;
        width += span;
        if (width >= column) {
          if (width > column) {
            warn(`"nzColumn" is ${column} but we have row length ${width}`);
          }
          currentRow.push({
            title,
            content,
            span: column - (width - span)
          });
          flushRow();
        } else if (i === length - 1) {
          currentRow.push({
            title,
            content,
            span: column - (width - span)
          });
          flushRow();
        } else {
          currentRow.push({
            title,
            content,
            span
          });
        }
      }
      this.itemMatrix = matrix;
    }
    getColumn() {
      if (typeof this.nzColumn !== "number") {
        return this.nzColumn[this.breakpoint];
      }
      return this.nzColumn;
    }
    static ɵfac = function NzDescriptionsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NzDescriptionsComponent2)();
    };
    static ɵcmp = ɵɵdefineComponent({
      type: NzDescriptionsComponent2,
      selectors: [["nz-descriptions"]],
      contentQueries: function NzDescriptionsComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, NzDescriptionsItemComponent, 4);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.items = _t);
        }
      },
      hostAttrs: [1, "ant-descriptions"],
      hostVars: 8,
      hostBindings: function NzDescriptionsComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("ant-descriptions-bordered", ctx.nzBordered)("ant-descriptions-middle", ctx.nzSize === "middle")("ant-descriptions-small", ctx.nzSize === "small")("ant-descriptions-rtl", ctx.dir === "rtl");
        }
      },
      inputs: {
        nzBordered: [2, "nzBordered", "nzBordered", booleanAttribute],
        nzLayout: "nzLayout",
        nzColumn: "nzColumn",
        nzSize: "nzSize",
        nzTitle: "nzTitle",
        nzExtra: "nzExtra",
        nzColon: [2, "nzColon", "nzColon", booleanAttribute]
      },
      exportAs: ["nzDescriptions"],
      features: [ɵɵNgOnChangesFeature],
      decls: 6,
      vars: 3,
      consts: [[1, "ant-descriptions-header"], [1, "ant-descriptions-view"], [1, "ant-descriptions-title"], [1, "ant-descriptions-extra"], [4, "nzStringTemplateOutlet"], [1, "ant-descriptions-row"], [1, "ant-descriptions-item", 3, "colSpan"], [1, "ant-descriptions-item-container"], [1, "ant-descriptions-item-label"], [1, "ant-descriptions-item-content"], [3, "ngTemplateOutlet"], [1, "ant-descriptions-item-content", 3, "colSpan"], [1, "ant-descriptions-item-label", 3, "colSpan"]],
      template: function NzDescriptionsComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵconditionalCreate(0, NzDescriptionsComponent_Conditional_0_Template, 3, 2, "div", 0);
          ɵɵelementStart(1, "div", 1)(2, "table")(3, "tbody");
          ɵɵconditionalCreate(4, NzDescriptionsComponent_Conditional_4_Template, 2, 0);
          ɵɵconditionalCreate(5, NzDescriptionsComponent_Conditional_5_Template, 2, 1);
          ɵɵelementEnd()()();
        }
        if (rf & 2) {
          ɵɵconditional(ctx.nzTitle || ctx.nzExtra ? 0 : -1);
          ɵɵadvance(4);
          ɵɵconditional(ctx.nzLayout === "horizontal" ? 4 : -1);
          ɵɵadvance();
          ɵɵconditional(ctx.nzLayout === "vertical" ? 5 : -1);
        }
      },
      dependencies: [NzOutletModule, NzStringTemplateOutletDirective, NgTemplateOutlet],
      encapsulation: 2,
      changeDetection: 0
    });
  };
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzDescriptionsComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-descriptions",
      exportAs: "nzDescriptions",
      template: `
    @if (nzTitle || nzExtra) {
      <div class="ant-descriptions-header">
        @if (nzTitle) {
          <div class="ant-descriptions-title">
            <ng-container *nzStringTemplateOutlet="nzTitle">{{ nzTitle }}</ng-container>
          </div>
        }
        @if (nzExtra) {
          <div class="ant-descriptions-extra">
            <ng-container *nzStringTemplateOutlet="nzExtra">{{ nzExtra }}</ng-container>
          </div>
        }
      </div>
    }

    <div class="ant-descriptions-view">
      <table>
        <tbody>
          @if (nzLayout === 'horizontal') {
            @for (row of itemMatrix; track row; let i = $index) {
              <tr class="ant-descriptions-row">
                @for (item of row; track item; let isLast = $last) {
                  @if (!nzBordered) {
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <div class="ant-descriptions-item-container">
                        <span class="ant-descriptions-item-label" [class.ant-descriptions-item-no-colon]="!nzColon">
                          <ng-container *nzStringTemplateOutlet="item.title">
                            {{ item.title }}
                          </ng-container>
                        </span>
                        <span class="ant-descriptions-item-content">
                          <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                        </span>
                      </div>
                    </td>
                  } @else {
                    <td class="ant-descriptions-item-label">
                      <ng-container *nzStringTemplateOutlet="item.title">
                        {{ item.title }}
                      </ng-container>
                    </td>
                    <td class="ant-descriptions-item-content" [colSpan]="item.span * 2 - 1">
                      <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                    </td>
                  }
                }
              </tr>
            }
          }

          @if (nzLayout === 'vertical') {
            @if (!nzBordered) {
              @for (row of itemMatrix; track row; let i = $index) {
                <tr class="ant-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <div class="ant-descriptions-item-container">
                        <span class="ant-descriptions-item-label" [class.ant-descriptions-item-no-colon]="!nzColon">
                          <ng-container *nzStringTemplateOutlet="item.title">
                            {{ item.title }}
                          </ng-container>
                        </span>
                      </div>
                    </td>
                  }
                </tr>
                <tr class="ant-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <div class="ant-descriptions-item-container">
                        <span class="ant-descriptions-item-content">
                          <ng-template [ngTemplateOutlet]="item.content" />
                        </span>
                      </div>
                    </td>
                  }
                </tr>
              }
            } @else {
              @for (row of itemMatrix; track row; let i = $index) {
                <tr class="ant-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="ant-descriptions-item-label" [colSpan]="item.span">
                      <ng-container *nzStringTemplateOutlet="item.title">
                        {{ item.title }}
                      </ng-container>
                    </td>
                  }
                </tr>
                <tr class="ant-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="ant-descriptions-item-content" [colSpan]="item.span">
                      <ng-template [ngTemplateOutlet]="item.content" />
                    </td>
                  }
                </tr>
              }
            }
          }
        </tbody>
      </table>
    </div>
  `,
      host: {
        class: "ant-descriptions",
        "[class.ant-descriptions-bordered]": "nzBordered",
        "[class.ant-descriptions-middle]": 'nzSize === "middle"',
        "[class.ant-descriptions-small]": 'nzSize === "small"',
        "[class.ant-descriptions-rtl]": 'dir === "rtl"'
      },
      imports: [NzOutletModule, NgTemplateOutlet]
    }]
  }], null, {
    items: [{
      type: ContentChildren,
      args: [NzDescriptionsItemComponent]
    }],
    nzBordered: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzLayout: [{
      type: Input
    }],
    nzColumn: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    nzTitle: [{
      type: Input
    }],
    nzExtra: [{
      type: Input
    }],
    nzColon: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzDescriptionsModule = class _NzDescriptionsModule {
  static ɵfac = function NzDescriptionsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzDescriptionsModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzDescriptionsModule,
    imports: [NzDescriptionsComponent, NzDescriptionsItemComponent],
    exports: [NzDescriptionsComponent, NzDescriptionsItemComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzDescriptionsComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzDescriptionsModule, [{
    type: NgModule,
    args: [{
      imports: [NzDescriptionsComponent, NzDescriptionsItemComponent],
      exports: [NzDescriptionsComponent, NzDescriptionsItemComponent]
    }]
  }], null, null);
})();
export {
  NzDescriptionsComponent,
  NzDescriptionsItemComponent,
  NzDescriptionsModule
};
//# sourceMappingURL=ng-zorro-antd_descriptions.js.map
