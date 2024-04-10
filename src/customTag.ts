export class Slider extends HTMLElement {
  showRoot: ShadowRoot;
  container: HTMLDivElement;
  hzText: HTMLSpanElement;
  maxDB: HTMLSpanElement;
  minDB: HTMLSpanElement;
  slider: HTMLInputElement;
  constructor() {
    super();
    this.showRoot = this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.hzText = document.createElement("span");
    this.maxDB = document.createElement("span");
    this.minDB = document.createElement("span");
    this.slider = document.createElement("input");

    this.hzText.innerText = this.getAttribute("title") ?? ""
    const maxStr = this.getAttribute("max") ?? "12";
    const minStr = this.getAttribute("min") ?? "-12";
    this.maxDB.innerText = `${maxStr}DB`;
    this.minDB.innerText = `${minStr}DB`;

    this.slider.type = "range";
    this.slider.setAttribute("max", maxStr);
    this.slider.setAttribute("min", minStr);
    this.slider.setAttribute("value", this.getAttribute("value") ?? "0");
    this.slider.setAttribute("step", this.getAttribute("step") ?? "0.5");

    this.showRoot.innerHTML = `<style>
    :host * {
        padding: 0;
        margin: 0;
    }
    :host div {
        display: flex;
        flex-direction: column;
        text-align: center;
    }
    :host input {
        width: 32px;
        height: 160px;
        writing-mode: vertical-lr;
        direction: rtl;
    }
    :host span {
        font-size: 0.6rem;
        line-height: 0.8rem;
        font-weight: 900;
    }
    </style>`;

    this.container.append(this.hzText, this.maxDB, this.slider, this.minDB);
    this.showRoot.appendChild(this.container);

    this.slider.addEventListener("input", () => {
      this.dispatchEvent(
        new CustomEvent("sliderChange", {
          detail: parseFloat(this.slider.value),
        })
      );
    });
  }

  reset() {
    this.slider.value = this.dataset.init ?? "0"
  }

  setValue(val: number) {
    this.slider.value = val.toString();
  }

  setTitle(title: string) {
    this.hzText.innerText = title;
  }

  setStep(val: number) {
    this.slider.setAttribute("step", val.toString());
  }


  setLimit(type: 'max' | 'min', value: number) {
    const str = value.toString();
    const text = `${str}DB`;
    if (type === "max") {
      this.maxDB.innerText = text;
      this.slider.setAttribute("max", str);
    } else {
      this.minDB.innerText = text;
      this.slider.setAttribute("min", str);
    }
  }
}

window.customElements.define("app-slider", Slider);
