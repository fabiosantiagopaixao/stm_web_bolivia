import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class AddressService {
  constructor() {
    const nameSheet = "address";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    const country = this.loggedUser?.country ?? "BO";
    this.getApi = new GetApiBaseService(nameSheet, country);
    this.writeApi = new PostService(nameSheet, country);
  }

  /* ========= GET ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  async getAddressById(addressId) {
    const data = await this.getByCongregation();
    return data.find((address) => address.id === addressId) || null;
  }

  /* ========= WRITE ========= */
  async saveUpdate(address) {
    if (address.id) {
      return this.writeApi.put(address);
    }
    return this.writeApi.post(address);
  }

  async delete(address) {
    return this.writeApi.delete(address);
  }
}
