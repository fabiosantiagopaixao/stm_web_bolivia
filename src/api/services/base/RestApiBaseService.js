const STORAGE_KEY = "stm_data_";

export class RestApiBaseService {
  constructor(sheet = "") {
    this.sheet = sheet; // Nome da sheet padrão
    this.proxyUrl =
      "https://stm-proxy-pxytqgsd0-fabios-projects-a860b1c6.vercel.app"; // URL do proxy
    this.keyStorage = STORAGE_KEY + this.sheet;
  }

  /* ======= MÉTODOS PRIVADOS ======= */
  #getProxyUrl(sheetName, method = null, queryParams = "") {
    const sheetToUse = sheetName || this.sheet;
    let url = `${this.proxyUrl}/${sheetToUse}`;
    if (method)
      url += `?method=${method}${queryParams ? "&" + queryParams : ""}`;
    return url;
  }

  #saveAsynStorage(data, congregationNumber = null) {
    const key = congregationNumber
      ? `${this.keyStorage}_${congregationNumber}`
      : this.keyStorage;
    localStorage.setItem(key, JSON.stringify(data));
  }

  #getAsynStorage(congregationNumber = null) {
    const key = congregationNumber
      ? `${this.keyStorage}_${congregationNumber}`
      : this.keyStorage;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /* ======= MÉTODOS PÚBLICOS ======= */
  async get(queryParams = "") {
    const dataStorage = this.#getAsynStorage();
    if (dataStorage) return dataStorage;

    const url = this.#getProxyUrl(this.sheet, null, queryParams);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data);
    return data;
  }

  async getByCongregation(congregationNumber) {
    const dataStorage = this.#getAsynStorage(congregationNumber);
    if (dataStorage) return dataStorage;

    const query = `congregation_number=${congregationNumber}`;
    const url = this.#getProxyUrl(this.sheet, null, query);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data, congregationNumber);
    return data;
  }

  async #postData(method, body) {
    const url = this.#getProxyUrl(this.sheet, method);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[POST][ERROR RESPONSE]:", text);
      throw new Error(`POST error: ${res.status} - ${text}`);
    }

    const responseJson = await res.json();
    return responseJson;
  }

  async post(body) {
    return this.#postData("POST", body);
  }

  async put(body) {
    return this.#postData("PUT", body);
  }

  clearStorage(congregationNumber = null) {
    const key = congregationNumber
      ? `${this.keyStorage}_${congregationNumber}`
      : this.keyStorage;
    localStorage.removeItem(key);
  }
}
