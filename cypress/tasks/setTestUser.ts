import { UserRepository } from "@/model/User";
import userFixtures from "../fixtures/users.json";

const userRepository = new UserRepository();

export default async function setTestUser() {
  return Promise.all(userFixtures.map((user) => userRepository.create(user)));
}
