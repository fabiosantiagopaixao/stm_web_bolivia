import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class VisitsService {
  constructor() {
    const nameSheet = "visits";
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

  /* ========= WRITE ========= */
  async saveUpdate(visit) {
    if (visit.id) {
      return this.writeApi.put(visit);
    }
    return this.writeApi.post(visit);
  }

  async delete(visit) {
    return this.writeApi.delete(visit);
  }
}
