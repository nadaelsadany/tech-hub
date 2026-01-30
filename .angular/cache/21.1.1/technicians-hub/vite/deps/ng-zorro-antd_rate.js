import {
  NzTooltipDirective,
  NzTooltipModule
} from "./chunk-43V5VCC2.js";
import "./chunk-EPZS7LVD.js";
import "./chunk-THBFB5YG.js";
import "./chunk-KD6O65DB.js";
import {
  LEFT_ARROW,
  RIGHT_ARROW
} from "./chunk-B7XDWOSB.js";
import "./chunk-2BQG7BAU.js";
import "./chunk-DNNB6HSL.js";
import "./chunk-P3FWHNQ7.js";
import {
  NzIconDirective,
  NzIconModule
} from "./chunk-VJ2ZN4HK.js";
import "./chunk-BQ76GOFF.js";
import "./chunk-QYDDKLT3.js";
import "./chunk-ZRDBGOGI.js";
import "./chunk-QE5DRVFI.js";
import "./chunk-HFVB5ZOX.js";
import {
  WithConfig,
  onConfigChangeEventForComponent
} from "./chunk-5TEZHPCR.js";
import {
  takeUntilDestroyed
} from "./chunk-RIV7STQV.js";
import {
  fromEventOutsideAngular
} from "./chunk-6YEP226A.js";
import "./chunk-JRIK2776.js";
import {
  Directionality
} from "./chunk-BTAEODP3.js";
import {
  NG_VALUE_ACCESSOR
} from "./chunk-GRU325SW.js";
import "./chunk-A43UZTE4.js";
import "./chunk-5XPOYATN.js";
import {
  NgTemplateOutlet
} from "./chunk-DGGTYZBC.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-KHOA27O3.js";
import "./chunk-SR2LXFJL.js";
import "./chunk-V37RSN4D.js";
import {
  __esDecorate,
  __runInitializers
} from "./chunk-VUVMRRXW.js";
import "./chunk-GOMI4DH3.js";

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-rate.mjs
var _c0 = ["nz-rate-item", ""];
var _c1 = (a0) => ({
  $implicit: a0
});
function NzRateItemComponent_ng_template_1_Template(rf, ctx) {
}
function NzRateItemComponent_ng_template_3_Template(rf, ctx) {
}
function NzRateItemComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "nz-icon", 4);
  }
}
var _c2 = ["ulElement"];
function NzRateComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 3)(1, "div", 4);
    ɵɵlistener("itemHover", function NzRateComponent_For_3_Template_div_itemHover_1_listener($event) {
      const $index_r3 = ɵɵrestoreView(_r2).$index;
      const ctx_r3 = ɵɵnextContext();
      return ɵɵresetView(ctx_r3.onItemHover($index_r3, $event));
    })("itemClick", function NzRateComponent_For_3_Template_div_itemClick_1_listener($event) {
      const $index_r3 = ɵɵrestoreView(_r2).$index;
      const ctx_r3 = ɵɵnextContext();
      return ɵɵresetView(ctx_r3.onItemClick($index_r3, $event));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const $index_r3 = ctx.$index;
    const ctx_r3 = ɵɵnextContext();
    ɵɵclassMap(ctx_r3.starStyleArray[$index_r3] || "");
    ɵɵproperty("nzTooltipTitle", ctx_r3.nzTooltips[$index_r3]);
    ɵɵadvance();
    ɵɵproperty("allowHalf", ctx_r3.nzAllowHalf)("character", ctx_r3.nzCharacter)("index", $index_r3);
  }
}
var NzRateItemComponent = class _NzRateItemComponent {
  character;
  index = 0;
  allowHalf = false;
  itemHover = new EventEmitter();
  itemClick = new EventEmitter();
  hoverRate(isHalf) {
    this.itemHover.next(isHalf && this.allowHalf);
  }
  clickRate(isHalf) {
    this.itemClick.next(isHalf && this.allowHalf);
  }
  static ɵfac = function NzRateItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzRateItemComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzRateItemComponent,
    selectors: [["", "nz-rate-item", ""]],
    inputs: {
      character: "character",
      index: "index",
      allowHalf: [2, "allowHalf", "allowHalf", booleanAttribute]
    },
    outputs: {
      itemHover: "itemHover",
      itemClick: "itemClick"
    },
    exportAs: ["nzRateItem"],
    attrs: _c0,
    decls: 6,
    vars: 8,
    consts: [["defaultCharacter", ""], [1, "ant-rate-star-second", 3, "mouseover", "click"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "ant-rate-star-first", 3, "mouseover", "click"], ["nzType", "star", "nzTheme", "fill"]],
    template: function NzRateItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 1);
        ɵɵlistener("mouseover", function NzRateItemComponent_Template_div_mouseover_0_listener($event) {
          ɵɵrestoreView(_r1);
          ctx.hoverRate(false);
          return ɵɵresetView($event.stopPropagation());
        })("click", function NzRateItemComponent_Template_div_click_0_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.clickRate(false));
        });
        ɵɵtemplate(1, NzRateItemComponent_ng_template_1_Template, 0, 0, "ng-template", 2);
        ɵɵelementEnd();
        ɵɵelementStart(2, "div", 3);
        ɵɵlistener("mouseover", function NzRateItemComponent_Template_div_mouseover_2_listener($event) {
          ɵɵrestoreView(_r1);
          ctx.hoverRate(true);
          return ɵɵresetView($event.stopPropagation());
        })("click", function NzRateItemComponent_Template_div_click_2_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.clickRate(true));
        });
        ɵɵtemplate(3, NzRateItemComponent_ng_template_3_Template, 0, 0, "ng-template", 2);
        ɵɵelementEnd();
        ɵɵtemplate(4, NzRateItemComponent_ng_template_4_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        const defaultCharacter_r2 = ɵɵreference(5);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.character || defaultCharacter_r2)("ngTemplateOutletContext", ɵɵpureFunction1(4, _c1, ctx.index));
        ɵɵadvance(2);
        ɵɵproperty("ngTemplateOutlet", ctx.character || defaultCharacter_r2)("ngTemplateOutletContext", ɵɵpureFunction1(6, _c1, ctx.index));
      }
    },
    dependencies: [NgTemplateOutlet, NzIconModule, NzIconDirective],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzRateItemComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "[nz-rate-item]",
      exportAs: "nzRateItem",
      template: `
    <div
      class="ant-rate-star-second"
      (mouseover)="hoverRate(false); $event.stopPropagation()"
      (click)="clickRate(false)"
    >
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
        [ngTemplateOutletContext]="{ $implicit: index }"
      ></ng-template>
    </div>
    <div class="ant-rate-star-first" (mouseover)="hoverRate(true); $event.stopPropagation()" (click)="clickRate(true)">
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
        [ngTemplateOutletContext]="{ $implicit: index }"
      ></ng-template>
    </div>

    <ng-template #defaultCharacter>
      <nz-icon nzType="star" nzTheme="fill" />
    </ng-template>
  `,
      imports: [NgTemplateOutlet, NzIconModule]
    }]
  }], null, {
    character: [{
      type: Input
    }],
    index: [{
      type: Input
    }],
    allowHalf: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    itemHover: [{
      type: Output
    }],
    itemClick: [{
      type: Output
    }]
  });
})();
var NZ_CONFIG_MODULE_NAME = "rate";
var NzRateComponent = (() => {
  let _nzAllowClear_decorators;
  let _nzAllowClear_initializers = [];
  let _nzAllowClear_extraInitializers = [];
  let _nzAllowHalf_decorators;
  let _nzAllowHalf_initializers = [];
  let _nzAllowHalf_extraInitializers = [];
  return class NzRateComponent2 {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _nzAllowClear_decorators = [WithConfig()];
      _nzAllowHalf_decorators = [WithConfig()];
      __esDecorate(null, null, _nzAllowClear_decorators, {
        kind: "field",
        name: "nzAllowClear",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzAllowClear" in obj,
          get: (obj) => obj.nzAllowClear,
          set: (obj, value) => {
            obj.nzAllowClear = value;
          }
        },
        metadata: _metadata
      }, _nzAllowClear_initializers, _nzAllowClear_extraInitializers);
      __esDecorate(null, null, _nzAllowHalf_decorators, {
        kind: "field",
        name: "nzAllowHalf",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzAllowHalf" in obj,
          get: (obj) => obj.nzAllowHalf,
          set: (obj, value) => {
            obj.nzAllowHalf = value;
          }
        },
        metadata: _metadata
      }, _nzAllowHalf_initializers, _nzAllowHalf_extraInitializers);
      if (_metadata) Object.defineProperty(this, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    }
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    ngZone = inject(NgZone);
    renderer = inject(Renderer2);
    cdr = inject(ChangeDetectorRef);
    directionality = inject(Directionality);
    destroyRef = inject(DestroyRef);
    ulElement;
    nzAllowClear = __runInitializers(this, _nzAllowClear_initializers, true);
    nzAllowHalf = (__runInitializers(this, _nzAllowClear_extraInitializers), __runInitializers(this, _nzAllowHalf_initializers, false));
    nzDisabled = (__runInitializers(this, _nzAllowHalf_extraInitializers), false);
    nzAutoFocus = false;
    nzCharacter;
    nzCount = 5;
    nzTooltips = [];
    nzOnBlur = new EventEmitter();
    nzOnFocus = new EventEmitter();
    nzOnHoverChange = new EventEmitter();
    nzOnKeyDown = new EventEmitter();
    classMap = {};
    starArray = [];
    starStyleArray = [];
    dir = "ltr";
    hasHalf = false;
    hoverValue = 0;
    isFocused = false;
    _value = 0;
    isNzDisableFirstChange = true;
    get nzValue() {
      return this._value;
    }
    set nzValue(input) {
      if (this._value === input) {
        return;
      }
      this._value = input;
      this.hasHalf = !Number.isInteger(input) && this.nzAllowHalf;
      this.hoverValue = Math.ceil(input);
    }
    constructor() {
      onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
    }
    ngOnChanges(changes) {
      const {
        nzAutoFocus,
        nzCount,
        nzValue
      } = changes;
      if (nzAutoFocus && !nzAutoFocus.isFirstChange()) {
        const el = this.ulElement.nativeElement;
        if (this.nzAutoFocus && !this.nzDisabled) {
          this.renderer.setAttribute(el, "autofocus", "autofocus");
        } else {
          this.renderer.removeAttribute(el, "autofocus");
        }
      }
      if (nzCount) {
        this.updateStarArray();
      }
      if (nzValue) {
        this.updateStarStyle();
      }
    }
    ngOnInit() {
      this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
      this.dir = this.directionality.value;
      fromEventOutsideAngular(this.ulElement.nativeElement, "focus").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        this.isFocused = true;
        if (this.nzOnFocus.observers.length) {
          this.ngZone.run(() => this.nzOnFocus.emit(event));
        }
      });
      fromEventOutsideAngular(this.ulElement.nativeElement, "blur").pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        this.isFocused = false;
        if (this.nzOnBlur.observers.length) {
          this.ngZone.run(() => this.nzOnBlur.emit(event));
        }
      });
    }
    onItemClick(index, isHalf) {
      if (this.nzDisabled) {
        return;
      }
      this.hoverValue = index + 1;
      const actualValue = isHalf ? index + 0.5 : index + 1;
      if (this.nzValue === actualValue) {
        if (this.nzAllowClear) {
          this.nzValue = 0;
          this.onChange(this.nzValue);
        }
      } else {
        this.nzValue = actualValue;
        this.onChange(this.nzValue);
      }
      this.updateStarStyle();
    }
    onItemHover(index, isHalf) {
      if (this.nzDisabled) {
        return;
      }
      if (this.hoverValue !== index + 1 || isHalf !== this.hasHalf) {
        this.hoverValue = index + 1;
        this.hasHalf = isHalf;
        this.updateStarStyle();
      }
      this.nzOnHoverChange.emit(this.hoverValue);
    }
    onRateLeave() {
      this.hasHalf = !Number.isInteger(this.nzValue);
      this.hoverValue = Math.ceil(this.nzValue);
      this.nzOnHoverChange.emit(this.hoverValue);
      this.updateStarStyle();
    }
    focus() {
      this.ulElement.nativeElement.focus();
    }
    blur() {
      this.ulElement.nativeElement.blur();
    }
    onKeyDown(e) {
      const oldVal = this.nzValue;
      if (e.keyCode === RIGHT_ARROW && this.nzValue < this.nzCount) {
        this.nzValue += this.nzAllowHalf ? 0.5 : 1;
      } else if (e.keyCode === LEFT_ARROW && this.nzValue > 0) {
        this.nzValue -= this.nzAllowHalf ? 0.5 : 1;
      }
      if (oldVal !== this.nzValue) {
        this.onChange(this.nzValue);
        this.nzOnKeyDown.emit(e);
        this.updateStarStyle();
        this.cdr.markForCheck();
      }
    }
    updateStarArray() {
      this.starArray = Array(this.nzCount).fill(0).map((_, i) => i);
      this.updateStarStyle();
    }
    updateStarStyle() {
      this.starStyleArray = this.starArray.map((i) => {
        const prefix = "ant-rate-star";
        const value = i + 1;
        return {
          [`${prefix}-full`]: value < this.hoverValue || !this.hasHalf && value === this.hoverValue,
          [`${prefix}-half`]: this.hasHalf && value === this.hoverValue,
          [`${prefix}-active`]: this.hasHalf && value === this.hoverValue,
          [`${prefix}-zero`]: value > this.hoverValue,
          [`${prefix}-focused`]: this.hasHalf && value === this.hoverValue && this.isFocused
        };
      });
    }
    writeValue(value) {
      this.nzValue = value || 0;
      this.updateStarArray();
      this.cdr.markForCheck();
    }
    setDisabledState(isDisabled) {
      this.nzDisabled = this.isNzDisableFirstChange && this.nzDisabled || isDisabled;
      this.isNzDisableFirstChange = false;
      this.cdr.markForCheck();
    }
    registerOnChange(fn) {
      this.onChange = fn;
    }
    registerOnTouched(fn) {
      this.onTouched = fn;
    }
    onChange = () => null;
    onTouched = () => null;
    static ɵfac = function NzRateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NzRateComponent2)();
    };
    static ɵcmp = ɵɵdefineComponent({
      type: NzRateComponent2,
      selectors: [["nz-rate"]],
      viewQuery: function NzRateComponent_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(_c2, 7);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.ulElement = _t.first);
        }
      },
      inputs: {
        nzAllowClear: [2, "nzAllowClear", "nzAllowClear", booleanAttribute],
        nzAllowHalf: [2, "nzAllowHalf", "nzAllowHalf", booleanAttribute],
        nzDisabled: [2, "nzDisabled", "nzDisabled", booleanAttribute],
        nzAutoFocus: [2, "nzAutoFocus", "nzAutoFocus", booleanAttribute],
        nzCharacter: "nzCharacter",
        nzCount: [2, "nzCount", "nzCount", numberAttribute],
        nzTooltips: "nzTooltips"
      },
      outputs: {
        nzOnBlur: "nzOnBlur",
        nzOnFocus: "nzOnFocus",
        nzOnHoverChange: "nzOnHoverChange",
        nzOnKeyDown: "nzOnKeyDown"
      },
      exportAs: ["nzRate"],
      features: [ɵɵProvidersFeature([{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzRateComponent2),
        multi: true
      }]), ɵɵNgOnChangesFeature],
      decls: 4,
      vars: 7,
      consts: [["ulElement", ""], [1, "ant-rate", 3, "keydown", "mouseleave", "tabindex"], ["nz-tooltip", "", 1, "ant-rate-star", 3, "class", "nzTooltipTitle"], ["nz-tooltip", "", 1, "ant-rate-star", 3, "nzTooltipTitle"], ["nz-rate-item", "", 3, "itemHover", "itemClick", "allowHalf", "character", "index"]],
      template: function NzRateComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = ɵɵgetCurrentView();
          ɵɵelementStart(0, "ul", 1, 0);
          ɵɵlistener("keydown", function NzRateComponent_Template_ul_keydown_0_listener($event) {
            ɵɵrestoreView(_r1);
            ctx.onKeyDown($event);
            return ɵɵresetView($event.preventDefault());
          })("mouseleave", function NzRateComponent_Template_ul_mouseleave_0_listener($event) {
            ɵɵrestoreView(_r1);
            ctx.onRateLeave();
            return ɵɵresetView($event.stopPropagation());
          });
          ɵɵrepeaterCreate(2, NzRateComponent_For_3_Template, 2, 6, "li", 2, ɵɵrepeaterTrackByIdentity);
          ɵɵelementEnd();
        }
        if (rf & 2) {
          ɵɵclassMap(ctx.classMap);
          ɵɵclassProp("ant-rate-disabled", ctx.nzDisabled)("ant-rate-rtl", ctx.dir === "rtl");
          ɵɵproperty("tabindex", ctx.nzDisabled ? -1 : 1);
          ɵɵadvance(2);
          ɵɵrepeater(ctx.starArray);
        }
      },
      dependencies: [NzTooltipModule, NzTooltipDirective, NzRateItemComponent],
      encapsulation: 2,
      changeDetection: 0
    });
  };
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzRateComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-rate",
      exportAs: "nzRate",
      template: `
    <ul
      #ulElement
      class="ant-rate"
      [class.ant-rate-disabled]="nzDisabled"
      [class.ant-rate-rtl]="dir === 'rtl'"
      [class]="classMap"
      (keydown)="onKeyDown($event); $event.preventDefault()"
      (mouseleave)="onRateLeave(); $event.stopPropagation()"
      [tabindex]="nzDisabled ? -1 : 1"
    >
      @for (star of starArray; track star) {
        <li
          class="ant-rate-star"
          [class]="starStyleArray[$index] || ''"
          nz-tooltip
          [nzTooltipTitle]="nzTooltips[$index]"
        >
          <div
            nz-rate-item
            [allowHalf]="nzAllowHalf"
            [character]="nzCharacter"
            [index]="$index"
            (itemHover)="onItemHover($index, $event)"
            (itemClick)="onItemClick($index, $event)"
          ></div>
        </li>
      }
    </ul>
  `,
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NzRateComponent),
        multi: true
      }],
      imports: [NzTooltipModule, NzRateItemComponent]
    }]
  }], () => [], {
    ulElement: [{
      type: ViewChild,
      args: ["ulElement", {
        static: true
      }]
    }],
    nzAllowClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzAllowHalf: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzDisabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzAutoFocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzCharacter: [{
      type: Input
    }],
    nzCount: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzTooltips: [{
      type: Input
    }],
    nzOnBlur: [{
      type: Output
    }],
    nzOnFocus: [{
      type: Output
    }],
    nzOnHoverChange: [{
      type: Output
    }],
    nzOnKeyDown: [{
      type: Output
    }]
  });
})();
var NzRateModule = class _NzRateModule {
  static ɵfac = function NzRateModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzRateModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzRateModule,
    imports: [NzRateComponent, NzRateItemComponent],
    exports: [NzRateComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [NzRateComponent, NzRateItemComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzRateModule, [{
    type: NgModule,
    args: [{
      imports: [NzRateComponent, NzRateItemComponent],
      exports: [NzRateComponent]
    }]
  }], null, null);
})();
export {
  NzRateComponent,
  NzRateItemComponent,
  NzRateModule
};
//# sourceMappingURL=ng-zorro-antd_rate.js.map
