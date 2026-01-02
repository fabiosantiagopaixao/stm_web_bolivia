import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class CongregationService {
  constructor() {
    const nameSheet = "congregation";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    const country = this.loggedUser?.country ?? "BO";
    this.getApi = new GetApiBaseService(nameSheet, country);
    this.writeApi = new PostService(nameSheet, country);
  }

  /* ========= WRITE ========= */
  async saveUpdate(congregation) {
    if (congregation.id) {
      return this.writeApi.put(congregation);
    }
    return this.writeApi.post(congregation);
  }

  async delete(congregation) {
    return this.writeApi.delete(congregation);
  }
}
