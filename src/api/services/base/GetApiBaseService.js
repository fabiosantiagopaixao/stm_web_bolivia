import { ApiBaseService } from "./ApiBaseService.js";

const SHEET_BY_COUNTRY = {
  BO: "AKfycbzplhjuuPVY6Zayt1UXuVcH_NmvzU-7L9CB_V9VIdh66vQ0IKbAazvy7tYofPMJ2PUNgg",
  BR: "BrazilSheet",
};

export class GetApiBaseService extends ApiBaseService {
  constructor(sheet = "", defaultCountry = "BO") {
    super(sheet);

    this.defaultCountry = defaultCountry;
    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.execSheet = "/exec?sheet=";
    this.idSheet = SHEET_BY_COUNTRY[defaultCountry];
  }

  /* ======= URL HELPERS (GET) ======= */

  #getBaseUrl() {
    if (!this.sheet) throw new Error("Sheet name not defined");
    if (!this.idSheet) throw new Error("Sheet id not defined");

    return `${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${this.sheet}`;
  }

  #getBaseUrlWithCongregation(congregationNumber) {
    if (!congregationNumber) {
      throw new Error("Congregation Number not defined");
    }

    return `${this.#getBaseUrl()}&congregation_number=${congregationNumber}`;
  }

  /* ======= GET ======= */

  async get() {
    const cache = this.getCache();
    if (cache) return cache;

    const res = await fetch(this.#getBaseUrl());
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.setCache(data);

    return data;
  }

  async getByCongregation(congregationNumber) {
    const cache = this.getCache();
    if (cache) return cache;

    const res = await fetch(
      this.#getBaseUrlWithCongregation(congregationNumber)
    );
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.setCache(data);

    return data;
  }
}
