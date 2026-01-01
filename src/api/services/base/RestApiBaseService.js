// src/api/services/RestApiBaseService.js

const STORAGE_KEY = "stm_data_";
const CACHE_CLEAR_INTERVAL = 10 * 60 * 1000; // 10 minutos
//const CACHE_CLEAR_INTERVAL = 1 * 60 * 1000; // 1 minuto
const CACHE_TIMESTAMP_KEY = "stm_cache_timestamp";

export class RestApiBaseService {
  constructor(sheet = "", defaultCountry = "BO") {
    this.sheet = sheet;
    this.defaultCountry = defaultCountry; // 🔹 país padrão
    this.proxyUrl = "https://stm-proxy.vercel.app/api/proxy";
    this.keyStorage = STORAGE_KEY + this.sheet;

    // 🔹 Limpeza automática ao iniciar
    RestApiBaseService.autoClearCacheIfNeeded();
  }

  /* ======= Cache local ======= */
  #saveAsyncStorage(data) {
    localStorage.setItem(this.keyStorage, JSON.stringify(data));
  }

  #getAsyncStorage() {
    const data = localStorage.getItem(this.keyStorage);
    return data ? JSON.parse(data) : null;
  }

  clearStorage() {
    localStorage.removeItem(this.keyStorage);
  }

  /* ======= GET ======= */
  async get(queryParams = {}) {
    const cached = this.#getAsyncStorage();
    if (cached) return cached;

    // 🔹 adiciona sheet + country automaticamente
    const query = new URLSearchParams({
      sheet: this.sheet,
      country: this.defaultCountry,
      ...queryParams,
    }).toString();

    const url = `${this.proxyUrl}?${query}`;
    console.log("GET URL:", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET error: ${res.status}`);

    const data = await res.json();

    // Só cacheia get geral
    this.#saveAsyncStorage(data);

    return data;
  }

  async getByCongregation(congregation_number) {
    if (!congregation_number) return [];
    return this.get({ congregation_number });
  }

  /* ======= POST / PUT / DELETE ======= */
  async #postData(method, body) {
    const query = new URLSearchParams({
      sheet: this.sheet,
      country: this.defaultCountry, // 🔹 adiciona country
      method,
    }).toString();

    const url = `${this.proxyUrl}?${query}`;
    console.log(`${method} URL:`, url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`${method} error: ${res.status}`);

    const data = await res.json();

    // 🔥 Limpa cache sempre que escrever
    this.clearStorage();

    return data;
  }

  post(body) {
    return this.#postData("POST", body);
  }

  put(body) {
    return this.#postData("PUT", body);
  }

  delete(body) {
    return this.#postData("DELETE", body);
  }

  static clearAllCacheLogout() {
    localStorage.clear(); // limpa tudo
    console.log("🧹 Cache STM limpo globalmente");
  }

  static clearCacheButIgnoreTheseKeys(ignoreKeys = []) {
    Object.keys(localStorage).forEach((key) => {
      if (!ignoreKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    console.log("🧹 Cache STM limpo globalmente, mantendo:", ignoreKeys);
  }

  static autoClearCacheIfNeeded() {
    const lastClear = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY));

    if (!lastClear || Date.now() - lastClear > CACHE_CLEAR_INTERVAL) {
      RestApiBaseService.clearCacheButIgnoreTheseKeys([
        CACHE_TIMESTAMP_KEY,
        "stm_logged_user",
      ]);

      // 🔹 Atualiza o timestamp para marcar a última limpeza
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }
  }
}
