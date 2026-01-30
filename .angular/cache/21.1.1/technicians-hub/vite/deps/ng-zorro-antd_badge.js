import {
  NzNoAnimationDirective,
  withAnimationCheck
} from "./chunk-P3FWHNQ7.js";
import "./chunk-QYDDKLT3.js";
import {
  NzOutletModule,
  NzStringTemplateOutletDirective
} from "./chunk-ZRDBGOGI.js";
import {
  WithConfig
} from "./chunk-5TEZHPCR.js";
import "./chunk-RIV7STQV.js";
import "./chunk-6YEP226A.js";
import "./chunk-JRIK2776.js";
import {
  Directionality
} from "./chunk-BTAEODP3.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵanimateEnter,
  ɵɵanimateLeave,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-KHOA27O3.js";
import "./chunk-SR2LXFJL.js";
import "./chunk-V37RSN4D.js";
import {
  __esDecorate,
  __runInitializers
} from "./chunk-VUVMRRXW.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-badge.mjs
function NzBadgeSupComponent_Conditional_0_For_1_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "p", 3);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    const ɵ$index_2_r2 = ɵɵnextContext(2).$index;
    const ctx_r2 = ɵɵnextContext(2);
    ɵɵclassProp("current", p_r1 === ctx_r2.countArray[ɵ$index_2_r2]);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", p_r1, " ");
  }
}
function NzBadgeSupComponent_Conditional_0_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzBadgeSupComponent_Conditional_0_For_1_Conditional_1_For_1_Template, 2, 3, "p", 2, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext(3);
    ɵɵrepeater(ctx_r2.countSingleArray);
  }
}
function NzBadgeSupComponent_Conditional_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 1);
    ɵɵconditionalCreate(1, NzBadgeSupComponent_Conditional_0_For_1_Conditional_1_Template, 2, 0);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ɵ$index_2_r2 = ctx.$index;
    const ctx_r2 = ɵɵnextContext(2);
    ɵɵstyleProp("transform", "translateY(" + -ctx_r2.countArray[ɵ$index_2_r2] * 100 + "%)");
    ɵɵproperty("nzNoAnimation", !!(ctx_r2.noAnimation == null ? null : ctx_r2.noAnimation.nzNoAnimation == null ? null : ctx_r2.noAnimation.nzNoAnimation()));
    ɵɵadvance();
    ɵɵconditional(!ctx_r2.nzDot && ctx_r2.countArray[ɵ$index_2_r2] !== void 0 ? 1 : -1);
  }
}
function NzBadgeSupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, NzBadgeSupComponent_Conditional_0_For_1_Template, 2, 4, "span", 0, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵrepeater(ctx_r2.maxNumberArray);
  }
}
function NzBadgeSupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵtextInterpolate1(" ", ctx_r2.nzOverflowCount, "+ ");
  }
}
var _c0 = ["*"];
function NzBadgeComponent_Conditional_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.nzText);
  }
}
function NzBadgeComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 1);
    ɵɵelementStart(1, "span", 2);
    ɵɵtemplate(2, NzBadgeComponent_Conditional_0_ng_container_2_Template, 2, 1, "ng-container", 0);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵstyleMap(ctx_r0.mergedStyle);
    ɵɵclassMap((ctx_r0.nzStatus || ctx_r0.presetColor) && "ant-badge-status-" + (ctx_r0.nzStatus || ctx_r0.presetColor));
    ɵɵadvance(2);
    ɵɵproperty("nzStringTemplateOutlet", ctx_r0.nzText);
  }
}
function NzBadgeComponent_ng_container_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "nz-badge-sup", 3);
    ɵɵanimateLeave(function NzBadgeComponent_ng_container_2_Conditional_1_Template_animateleave_cb() {
      ɵɵrestoreView(_r2);
      const ctx_r0 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r0.supAnimationLeave());
    });
    ɵɵanimateEnter(function NzBadgeComponent_ng_container_2_Conditional_1_Template_animateenter_cb() {
      ɵɵrestoreView(_r2);
      const ctx_r0 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r0.supAnimationEnter());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("isPresetColor", ctx_r0.nzStatus || ctx_r0.presetColor)("nzColor", ctx_r0.nzStatus || ctx_r0.presetColor || ctx_r0.nzColor)("nzOffset", ctx_r0.nzOffset)("nzSize", ctx_r0.nzSize)("nzTitle", ctx_r0.nzTitle)("nzStyle", ctx_r0.mergedStyle)("nzDot", ctx_r0.nzDot)("nzCount", ctx_r0.nzCount)("nzOverflowCount", ctx_r0.nzOverflowCount);
  }
}
function NzBadgeComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵconditionalCreate(1, NzBadgeComponent_ng_container_2_Conditional_1_Template, 1, 9, "nz-badge-sup", 3);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵconditional(ctx_r0.showSup ? 1 : -1);
  }
}
function NzRibbonComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "span", 3);
    ɵɵtext(2);
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.nzText);
  }
}
var NzBadgeSupComponent = class _NzBadgeSupComponent {
  noAnimation = inject(NzNoAnimationDirective, {
    host: true,
    optional: true
  });
  nzOffset;
  nzTitle;
  nzStyle = null;
  nzDot = false;
  nzOverflowCount = 99;
  nzCount;
  nzSize = "default";
  isPresetColor = false;
  nzColor;
  maxNumberArray = [];
  countArray = [];
  count = 0;
  countSingleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  generateMaxNumberArray() {
    this.maxNumberArray = this.nzOverflowCount.toString().split("").map((value, index) => `${value}-${index}`);
  }
  ngOnInit() {
    this.generateMaxNumberArray();
  }
  ngOnChanges(changes) {
    const {
      nzOverflowCount,
      nzCount
    } = changes;
    if (nzCount && typeof nzCount.currentValue === "number") {
      this.count = Math.max(0, nzCount.currentValue);
      this.countArray = this.count.toString().split("").map((item) => +item);
    }
    if (nzOverflowCount) {
      this.generateMaxNumberArray();
    }
  }
  static ɵfac = function NzBadgeSupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzBadgeSupComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzBadgeSupComponent,
    selectors: [["nz-badge-sup"]],
    hostAttrs: [1, "ant-scroll-number"],
    hostVars: 17,
    hostBindings: function NzBadgeSupComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("title", ctx.nzTitle === null ? "" : ctx.nzTitle || ctx.nzCount);
        ɵɵstyleMap(ctx.nzStyle);
        ɵɵclassMap(ctx.isPresetColor ? "ant-badge-status-" + ctx.nzColor : "");
        ɵɵstyleProp("right", ctx.nzOffset && ctx.nzOffset[0] ? -ctx.nzOffset[0] : null, "px")("margin-top", ctx.nzOffset && ctx.nzOffset[1] ? ctx.nzOffset[1] : null, "px");
        ɵɵclassProp("ant-badge-count", !ctx.nzDot)("ant-badge-count-sm", ctx.nzSize === "small")("ant-badge-dot", ctx.nzDot)("ant-badge-multiple-words", ctx.countArray.length >= 2);
      }
    },
    inputs: {
      nzOffset: "nzOffset",
      nzTitle: "nzTitle",
      nzStyle: "nzStyle",
      nzDot: "nzDot",
      nzOverflowCount: [2, "nzOverflowCount", "nzOverflowCount", numberAttribute],
      nzCount: "nzCount",
      nzSize: "nzSize",
      isPresetColor: [2, "isPresetColor", "isPresetColor", booleanAttribute],
      nzColor: "nzColor"
    },
    exportAs: ["nzBadgeSup"],
    features: [ɵɵNgOnChangesFeature],
    decls: 2,
    vars: 1,
    consts: [[1, "ant-scroll-number-only", 3, "nzNoAnimation", "transform"], [1, "ant-scroll-number-only", 3, "nzNoAnimation"], [1, "ant-scroll-number-only-unit", 3, "current"], [1, "ant-scroll-number-only-unit"]],
    template: function NzBadgeSupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, NzBadgeSupComponent_Conditional_0_Template, 2, 0)(1, NzBadgeSupComponent_Conditional_1_Template, 1, 1);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.count <= ctx.nzOverflowCount ? 0 : 1);
      }
    },
    dependencies: [NzNoAnimationDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzBadgeSupComponent, [{
    type: Component,
    args: [{
      selector: "nz-badge-sup",
      exportAs: "nzBadgeSup",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NzNoAnimationDirective],
      template: `
    @if (count <= nzOverflowCount) {
      @for (n of maxNumberArray; track n; let i = $index) {
        <span
          [nzNoAnimation]="!!noAnimation?.nzNoAnimation?.()"
          class="ant-scroll-number-only"
          [style.transform]="'translateY(' + -countArray[i] * 100 + '%)'"
        >
          @if (!nzDot && countArray[i] !== undefined) {
            @for (p of countSingleArray; track p) {
              <p class="ant-scroll-number-only-unit" [class.current]="p === countArray[i]">
                {{ p }}
              </p>
            }
          }
        </span>
      }
    } @else {
      {{ nzOverflowCount }}+
    }
  `,
      host: {
        class: "ant-scroll-number",
        "[class]": `isPresetColor ? ('ant-badge-status-' + nzColor) : ''`,
        "[attr.title]": `nzTitle === null ? '' : nzTitle || nzCount`,
        "[style]": `nzStyle`,
        "[style.right.px]": `nzOffset && nzOffset[0] ? -nzOffset[0] : null`,
        "[style.margin-top.px]": `nzOffset && nzOffset[1] ? nzOffset[1] : null`,
        "[class.ant-badge-count]": `!nzDot`,
        "[class.ant-badge-count-sm]": `nzSize === 'small'`,
        "[class.ant-badge-dot]": `nzDot`,
        "[class.ant-badge-multiple-words]": `countArray.length >= 2`
      }
    }]
  }], null, {
    nzOffset: [{
      type: Input
    }],
    nzTitle: [{
      type: Input
    }],
    nzStyle: [{
      type: Input
    }],
    nzDot: [{
      type: Input
    }],
    nzOverflowCount: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzCount: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }],
    isPresetColor: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzColor: [{
      type: Input
    }]
  });
})();
var badgePresetColors = ["pink", "red", "yellow", "orange", "cyan", "green", "blue", "purple", "geekblue", "magenta", "volcano", "gold", "lime"];
var NZ_CONFIG_MODULE_NAME = "badge";
var NzBadgeComponent = (() => {
  let _nzOverflowCount_decorators;
  let _nzOverflowCount_initializers = [];
  let _nzOverflowCount_extraInitializers = [];
  let _nzColor_decorators;
  let _nzColor_initializers = [];
  let _nzColor_extraInitializers = [];
  return class NzBadgeComponent2 {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _nzOverflowCount_decorators = [WithConfig()];
      _nzColor_decorators = [WithConfig()];
      __esDecorate(null, null, _nzOverflowCount_decorators, {
        kind: "field",
        name: "nzOverflowCount",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzOverflowCount" in obj,
          get: (obj) => obj.nzOverflowCount,
          set: (obj, value) => {
            obj.nzOverflowCount = value;
          }
        },
        metadata: _metadata
      }, _nzOverflowCount_initializers, _nzOverflowCount_extraInitializers);
      __esDecorate(null, null, _nzColor_decorators, {
        kind: "field",
        name: "nzColor",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzColor" in obj,
          get: (obj) => obj.nzColor,
          set: (obj, value) => {
            obj.nzColor = value;
          }
        },
        metadata: _metadata
      }, _nzColor_initializers, _nzColor_extraInitializers);
      if (_metadata) Object.defineProperty(this, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    }
    dir = inject(Directionality).valueSignal;
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    showSup = false;
    supAnimationEnter = withAnimationCheck(() => "ant-badge-zoom-enter");
    supAnimationLeave = withAnimationCheck(() => "ant-badge-zoom-leave");
    presetColor = null;
    nzShowZero = false;
    nzShowDot = true;
    nzStandalone = false;
    nzDot = false;
    nzOverflowCount = __runInitializers(this, _nzOverflowCount_initializers, 99);
    nzColor = (__runInitializers(this, _nzOverflowCount_extraInitializers), __runInitializers(this, _nzColor_initializers, void 0));
    nzStyle = (__runInitializers(this, _nzColor_extraInitializers), null);
    nzText = null;
    nzTitle;
    nzStatus;
    nzCount;
    nzOffset;
    nzSize = "default";
    get mergedStyle() {
      return __spreadValues({
        backgroundColor: !this.presetColor && this.nzColor
      }, this.nzStyle ?? {});
    }
    ngOnChanges(changes) {
      const {
        nzColor,
        nzShowDot,
        nzDot,
        nzCount,
        nzShowZero
      } = changes;
      if (nzColor) {
        this.presetColor = this.nzColor && badgePresetColors.indexOf(this.nzColor) !== -1 ? this.nzColor : null;
      }
      if (nzShowDot || nzDot || nzCount || nzShowZero) {
        this.showSup = this.nzShowDot && this.nzDot || typeof this.nzCount === "number" && (this.nzCount > 0 || this.nzShowZero);
      }
    }
    static ɵfac = function NzBadgeComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NzBadgeComponent2)();
    };
    static ɵcmp = ɵɵdefineComponent({
      type: NzBadgeComponent2,
      selectors: [["nz-badge"]],
      hostAttrs: [1, "ant-badge"],
      hostVars: 6,
      hostBindings: function NzBadgeComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("ant-badge-status", ctx.nzStatus)("ant-badge-not-a-wrapper", !!(ctx.nzStandalone || (ctx.nzStatus || ctx.nzColor) && !ctx.showSup && !ctx.nzCount))("ant-badge-rtl", ctx.dir() === "rtl");
        }
      },
      inputs: {
        nzShowZero: [2, "nzShowZero", "nzShowZero", booleanAttribute],
        nzShowDot: [2, "nzShowDot", "nzShowDot", booleanAttribute],
        nzStandalone: [2, "nzStandalone", "nzStandalone", booleanAttribute],
        nzDot: [2, "nzDot", "nzDot", booleanAttribute],
        nzOverflowCount: "nzOverflowCount",
        nzColor: "nzColor",
        nzStyle: "nzStyle",
        nzText: "nzText",
        nzTitle: "nzTitle",
        nzStatus: "nzStatus",
        nzCount: "nzCount",
        nzOffset: "nzOffset",
        nzSize: "nzSize"
      },
      exportAs: ["nzBadge"],
      features: [ɵɵNgOnChangesFeature],
      ngContentSelectors: _c0,
      decls: 3,
      vars: 2,
      consts: [[4, "nzStringTemplateOutlet"], [1, "ant-badge-status-dot"], [1, "ant-badge-status-text"], [3, "isPresetColor", "nzColor", "nzOffset", "nzSize", "nzTitle", "nzStyle", "nzDot", "nzCount", "nzOverflowCount"]],
      template: function NzBadgeComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵconditionalCreate(0, NzBadgeComponent_Conditional_0_Template, 3, 5);
          ɵɵprojection(1);
          ɵɵtemplate(2, NzBadgeComponent_ng_container_2_Template, 2, 1, "ng-container", 0);
        }
        if (rf & 2) {
          ɵɵconditional((ctx.nzStatus || ctx.nzColor) && !ctx.showSup && !ctx.nzCount ? 0 : -1);
          ɵɵadvance(2);
          ɵɵproperty("nzStringTemplateOutlet", ctx.nzCount);
        }
      },
      dependencies: [NzBadgeSupComponent, NzOutletModule, NzStringTemplateOutletDirective],
      encapsulation: 2,
      changeDetection: 0
    });
  };
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzBadgeComponent, [{
    type: Component,
    args: [{
      selector: "nz-badge",
      exportAs: "nzBadge",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NzBadgeSupComponent, NzOutletModule],
      template: `
    @if ((nzStatus || nzColor) && !showSup && !nzCount) {
      <span
        class="ant-badge-status-dot"
        [class]="(nzStatus || presetColor) && 'ant-badge-status-' + (nzStatus || presetColor)"
        [style]="mergedStyle"
      ></span>
      <span class="ant-badge-status-text">
        <ng-container *nzStringTemplateOutlet="nzText">{{ nzText }}</ng-container>
      </span>
    }
    <ng-content />
    <ng-container *nzStringTemplateOutlet="nzCount">
      @if (showSup) {
        <nz-badge-sup
          [isPresetColor]="nzStatus || presetColor"
          [nzColor]="nzStatus || presetColor || nzColor"
          [nzOffset]="nzOffset"
          [nzSize]="nzSize"
          [nzTitle]="nzTitle"
          [nzStyle]="mergedStyle"
          [nzDot]="nzDot"
          [nzCount]="nzCount"
          [nzOverflowCount]="nzOverflowCount"
          [animate.enter]="supAnimationEnter()"
          [animate.leave]="supAnimationLeave()"
        />
      }
    </ng-container>
  `,
      host: {
        class: "ant-badge",
        "[class.ant-badge-status]": "nzStatus",
        "[class.ant-badge-not-a-wrapper]": "!!(nzStandalone || ((nzStatus || nzColor) && !showSup && !nzCount))",
        "[class.ant-badge-rtl]": 'dir() === "rtl"'
      }
    }]
  }], null, {
    nzShowZero: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzShowDot: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzStandalone: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzDot: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzOverflowCount: [{
      type: Input
    }],
    nzColor: [{
      type: Input
    }],
    nzStyle: [{
      type: Input
    }],
    nzText: [{
      type: Input
    }],
    nzTitle: [{
      type: Input
    }],
    nzStatus: [{
      type: Input
    }],
    nzCount: [{
      type: Input
    }],
    nzOffset: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }]
  });
})();
var NzRibbonComponent = class _NzRibbonComponent {
  nzColor;
  nzPlacement = "end";
  nzText = null;
  presetColor = null;
  ngOnChanges(changes) {
    const {
      nzColor
    } = changes;
    if (nzColor) {
      this.presetColor = this.nzColor && badgePresetColors.indexOf(this.nzColor) !== -1 ? this.nzColor : null;
    }
  }
  static ɵfac = function NzRibbonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzRibbonComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzRibbonComponent,
    selectors: [["nz-ribbon"]],
    hostAttrs: [1, "ant-ribbon-wrapper"],
    inputs: {
      nzColor: "nzColor",
      nzPlacement: "nzPlacement",
      nzText: "nzText"
    },
    exportAs: ["nzRibbon"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 4,
    vars: 11,
    consts: [[1, "ant-ribbon"], [4, "nzStringTemplateOutlet"], [1, "ant-ribbon-corner"], [1, "ant-ribbon-text"]],
    template: function NzRibbonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
        ɵɵelementStart(1, "div", 0);
        ɵɵtemplate(2, NzRibbonComponent_ng_container_2_Template, 3, 1, "ng-container", 1);
        ɵɵelement(3, "div", 2);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵclassMap(ctx.presetColor && "ant-ribbon-color-" + ctx.presetColor);
        ɵɵstyleProp("background-color", !ctx.presetColor && ctx.nzColor);
        ɵɵclassProp("ant-ribbon-placement-end", ctx.nzPlacement === "end")("ant-ribbon-placement-start", ctx.nzPlacement === "start");
        ɵɵadvance();
        ɵɵproperty("nzStringTemplateOutlet", ctx.nzText);
        ɵɵadvance();
        ɵɵstyleProp("color", !ctx.presetColor && ctx.nzColor);
      }
    },
    dependencies: [NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzRibbonComponent, [{
    type: Component,
    args: [{
      selector: "nz-ribbon",
      exportAs: "nzRibbon",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NzOutletModule],
      template: `
    <ng-content />
    <div
      class="ant-ribbon"
      [class]="presetColor && 'ant-ribbon-color-' + presetColor"
      [class.ant-ribbon-placement-end]="nzPlacement === 'end'"
      [class.ant-ribbon-placement-start]="nzPlacement === 'start'"
      [style.background-color]="!presetColor && nzColor"
    >
      <ng-container *nzStringTemplateOutlet="nzText">
        <span class="ant-ribbon-text">{{ nzText }}</span>
      </ng-container>
      <div class="ant-ribbon-corner" [style.color]="!presetColor && nzColor"></div>
    </div>
  `,
      host: {
        class: "ant-ribbon-wrapper"
      }
    }]
  }], null, {
    nzColor: [{
      type: Input
    }],
    nzPlacement: [{
      type: Input
    }],
    nzText: [{
      type: Input
    }]
  });
})();
var NzBadgeModule = class _NzBadgeModule {
  static ɵfac = function NzBadgeModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzBadgeModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzBadgeModule,
    imports: [NzBadgeComponent, NzRibbonComponent],
    exports: [NzBadgeComponent, NzRibbonComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzBadgeComponent, NzRibbonComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzBadgeModule, [{
    type: NgModule,
    args: [{
      exports: [NzBadgeComponent, NzRibbonComponent],
      imports: [NzBadgeComponent, NzRibbonComponent]
    }]
  }], null, null);
})();
export {
  NzBadgeComponent,
  NzBadgeModule,
  NzRibbonComponent
};
//# sourceMappingURL=ng-zorro-antd_badge.js.map
