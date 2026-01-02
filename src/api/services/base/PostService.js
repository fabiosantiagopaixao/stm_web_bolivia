import { ApiBaseService } from "./ApiBaseService.js";

export class PostService extends ApiBaseService {
  constructor(sheet = "", defaultCountry = "BO") {
    super(sheet);

    this.defaultCountry = defaultCountry;
    this.proxyUrl = "https://stm-proxy.vercel.app/api/proxy";
  }

  async #request(method, body) {
    const query = new URLSearchParams({
      sheet: this.sheet,
      country: this.defaultCountry,
      method,
    }).toString();

    const url = `${this.proxyUrl}?${query}`;
    console.log(`${method} →`, url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`${method} error: ${res.status}`);
    }

    this.clearCache(); // 🔥 escrita invalida cache
    return res.json();
  }

  post(body) {
    return this.#request("POST", body);
  }

  put(body) {
    return this.#request("PUT", body);
  }

  delete(body) {
    return this.#request("DELETE", body);
  }
}
