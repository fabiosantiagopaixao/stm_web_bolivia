import { RestApiBaseService } from "./base/RestApiBaseService.js";

export class AddressService extends RestApiBaseService {
  constructor() {
    super("address");
  }

  async getAddressById(addressId, congregationNumber) {
    const data = await this.getByCongregation(congregationNumber);

    return data.find((address) => address.id === addressId) || null;
  }
}
