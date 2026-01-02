const STORAGE_KEY = "stm_data_";
const CACHE_CLEAR_INTERVAL = 10 * 60 * 1000;
const CACHE_TIMESTAMP_KEY = "stm_cache_timestamp";

export class ApiBaseService {
  constructor(sheet) {
    this.sheet = sheet;
    this.storageKey = STORAGE_KEY + sheet;

    ApiBaseService.autoClearCacheIfNeeded();
  }

  getCache() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  setCache(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  clearCache() {
    localStorage.removeItem(this.storageKey);
  }

  /* ========== STATIC HELPERS ========== */

  static clearAllCacheLogout() {
    localStorage.clear();
    console.log("🧹 Cache STM limpo");
  }

  static clearCacheButIgnore(ignoreKeys = []) {
    Object.keys(localStorage).forEach((key) => {
      if (!ignoreKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  static autoClearCacheIfNeeded() {
    const lastClear = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY));

    if (!lastClear || Date.now() - lastClear > CACHE_CLEAR_INTERVAL) {
      ApiBaseService.clearCacheButIgnore([
        CACHE_TIMESTAMP_KEY,
        "stm_logged_user",
      ]);

      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }
  }
}
