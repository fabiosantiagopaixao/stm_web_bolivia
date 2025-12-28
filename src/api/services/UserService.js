import { RestApiBaseService } from "./base/RestApiBaseService.js";

export class UserService extends RestApiBaseService {
  constructor() {
    super("user");
  }

  saveUpdate(user) {
    if (user.id) {
      return this.put(user);
    }
    return this.post(user);
  }
}
