import { UserRepository } from "@/model/User";
import userFixtures from "../fixtures/users.json";

const userRepository = new UserRepository();

export default async function seedUsers() {
  return Promise.all(userFixtures.map((user) => userRepository.create(user)));
}
