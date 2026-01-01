import { RestApiBaseService } from "./base/RestApiBaseService.js";

export class TerritoryService extends RestApiBaseService {
  constructor() {
    super("territory");
  }

  async getTerritoryByNumber(number, congregationNumber) {
    const data = await this.getByCongregation(congregationNumber);

    return data.find((territory) => territory.number === number) || null;
  }
}
