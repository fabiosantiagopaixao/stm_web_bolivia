import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class TerritoryService {
  constructor() {
    const nameSheet = "territory";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    const country = this.loggedUser?.country ?? "BO";
    this.getApi = new GetApiBaseService(nameSheet, country);
    this.writeApi = new PostService(nameSheet, country);
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  async getTerritoryByNumber(number) {
    const data = await this.getByCongregation();
    return data.find((territory) => territory.number === number) || null;
  }

  async getLastNumberPlus1() {
    this.getApi.clearStorage();
    const data = await this.getByCongregation();

    // Extrai os números removendo "T-" e converte para number
    const numbers = data
      .map((item) => item.number)
      .filter(Boolean)
      .map((value) => Number(value.replace("T-", "")))
      .filter((n) => !isNaN(n));

    const maxNumber = numbers.length ? Math.max(...numbers) : 0;

    const nextNumber = maxNumber + 1;
    return `T-${String(nextNumber).padStart(4, "0")}`;
  }

  /* ========= WRITE ========= */
  async saveUpdate(territory) {
    if (territory.id) {
      return this.writeApi.put(territory);
    }
    return this.writeApi.post(territory);
  }

  async delete(territory) {
    return this.writeApi.delete(territory);
  }
}
