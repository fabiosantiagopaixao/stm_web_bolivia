const STORAGE_KEY = "stm_data_";

export class RestApiBaseService {
  constructor(sheet = "") {
    this.sheet = sheet; // Nome da sheet padrão
    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.idSheet =
      "AKfycbwR3WVAPyUhzXVUniBlHvKtkcOA7ORiIPZGf4YzD9sCuDKSpbhqYw_IK4nvrqnelBetVw";
    this.execSheet = "/exec?sheet=";
    this.keyStorage = STORAGE_KEY + this.sheet;
  }

  /* ======= MÉTODOS PRIVADOS ======= */
  #getBaseUrl(sheetName) {
    const sheetToUse = sheetName || this.sheet;
    if (!sheetToUse) throw new Error("Sheet name not defined");
    return `${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${sheetToUse}`;
  }

  #getBaseUrlWithCongregation(congregationNumber) {
    if (!congregationNumber) throw new Error("Congregation Number not defined");
    return `${this.#getBaseUrl(
      this.sheet
    )}&congregation_number=${congregationNumber}`;
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
  async get() {
    const dataStorage = this.#getAsynStorage();
    if (dataStorage) return dataStorage;

    const url = this.#getBaseUrl(this.sheet);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data);
    return data;
  }

  async getByCongregation(congregationNumber) {
    const dataStorage = this.#getAsynStorage(congregationNumber);
    if (dataStorage) return dataStorage;

    const url = this.#getBaseUrlWithCongregation(congregationNumber);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data, congregationNumber);
    return data;
  }

  async #postData(method, body) {
    // 🔍 LOG DO OBJETO ORIGINAL
    console.log("[POST][BODY - object]:", body);

    // 🔍 LOG DO JSON QUE VAI SER ENVIADO
    const jsonBody = JSON.stringify(body);
    console.log("[POST][BODY - json]:", jsonBody);

    const url = `${this.#getBaseUrl(this.sheet)}&method=${method}`;
    console.log("[POST][URL]:", url);

    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: jsonBody,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[POST][ERROR RESPONSE]:", text);
      throw new Error(`POST error: ${res.status} - ${text}`);
    }

    const responseJson = await res.json();
    console.log("[POST][RESPONSE]:", responseJson);

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
