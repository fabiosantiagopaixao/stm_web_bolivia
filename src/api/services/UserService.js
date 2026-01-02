import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";

export class UserService {
  constructor() {
    const nameSheet = "user";
    this.loggedUser = this.#getLoggedUser();

    const country = this.loggedUser?.country ?? "BO";
    this.getApi = new GetApiBaseService(nameSheet, country);
    this.writeApi = new PostService(nameSheet, country);
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  #getLoggedUser() {
    const data = localStorage.getItem("stm_logged_user");
    return data ? JSON.parse(data) : null;
  }

  /* ========= WRITE ========= */
  async saveUpdate(user) {
    if (user.id) {
      return this.writeApi.put(user);
    }
    return this.writeApi.post(user);
  }

  async delete(user) {
    return this.writeApi.delete(user);
  }
}
