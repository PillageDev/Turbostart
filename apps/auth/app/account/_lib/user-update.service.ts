import { updateUserNameAction } from "./server-actions";

export function createUserUpdateService() {
  return new UserUpdateService();
}

class UserUpdateService {
  async updateUserName(name: string, userId: string) {
    await updateUserNameAction({ name, id: userId });
  }
}
