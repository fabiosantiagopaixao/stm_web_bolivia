import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class NewsService {
  constructor() {
    const nameSheet = "news";
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
  async saveUpdate(newsItem) {
    if (newsItem.id) {
      return this.writeApi.put(newsItem);
    }
    return this.writeApi.post(newsItem);
  }

  async delete(newsItem) {
    return this.writeApi.delete(newsItem);
  }
}
