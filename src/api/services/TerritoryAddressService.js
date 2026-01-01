import { RestApiBaseService } from "./base/RestApiBaseService.js";
import { TerritoryService } from "./TerritoryService.js";
import { AddressService } from "./AddressService.js";

export class TerritoryAddressService extends RestApiBaseService {
  constructor() {
    super("territory_address");
    this.territoryService = new TerritoryService();
    this.addressService = new AddressService();
  }

  async getByTerritoryNumber(territoryNumber, congregationNumber) {
    const data = await this.getByCongregation(congregationNumber);

    const list = data.filter(
      (item) => item.territory_number === territoryNumber
    );

    const result = [];
    const addedTerritories = new Set(); // controla duplicados

    for (const item of list) {
      const territory = await this.territoryService.getTerritoryByNumber(
        item.territory_number,
        congregationNumber
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

  async getTerritoriesByAddressId(addressId, congregationNumber) {
    const data = await this.getByCongregation(congregationNumber);

    const list = data.filter((territory) => territory.address_id === addressId);

    const result = [];

    for (const item of list) {
      const address = await this.addressService.getAddressById(
        item.address_id,
        congregationNumber
      );

      if (address) {
        result.push({
          ...item,
          address,
        });
      }
    }

    return result;
  }
}
