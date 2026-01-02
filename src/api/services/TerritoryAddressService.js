import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { TerritoryService } from "./TerritoryService.js";
import { AddressService } from "./AddressService.js";
import { LoginService } from "../../api/LoginService.js";

export class TerritoryAddressService {
  constructor() {
    const nameSheet = "territory_address";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    const country = this.loggedUser?.country ?? "BO";
    this.getApi = new GetApiBaseService(nameSheet, country);
    this.writeApi = new PostService(nameSheet, country);

    this.territoryService = new TerritoryService();
    this.addressService = new AddressService();
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  async getByTerritoryNumber(territoryNumber) {
    const data = await this.getByCongregation();

    const list = data.filter(
      (item) => item.territory_number === territoryNumber
    );

    const result = [];
    const addedTerritories = new Set();

    for (const item of list) {
      const territory = await this.territoryService.getTerritoryByNumber(
        item.territory_number
      );

      if (territory && !addedTerritories.has(territory.number)) {
        addedTerritories.add(territory.number);
        result.push({
          ...item,
          territory,
        });
      }
    }

    return result;
  }

  async getTerritoriesByAddressId(addressId) {
    const data = await this.getByCongregation();

    const list = data.filter((item) => item.address_id === addressId);

    const result = [];

    for (const item of list) {
      const address = await this.addressService.getAddressById(item.address_id);

      if (address) {
        result.push({
          ...item,
          address,
        });
      }
    }

    return result;
  }

  /* ========= WRITE ========= */
  async saveUpdate(territoryAddress) {
    if (territoryAddress.id) {
      return this.writeApi.put(territoryAddress);
    }
    return this.writeApi.post(territoryAddress);
  }

  async delete(territoryAddress) {
    return this.writeApi.delete(territoryAddress);
  }
}
