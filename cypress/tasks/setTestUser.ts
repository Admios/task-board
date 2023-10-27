import { UserRepository } from "@/model/User";

export default async function setTestUser() {
  const userRepository = new UserRepository();
  const dummyEmail = `test1@example.com`;
  return userRepository.create({
    email: dummyEmail,
  });
}
