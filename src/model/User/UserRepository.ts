import { User } from "@/model/types";
import { AbstractRepository } from "../AbstractRepository";
import { UserModel } from "./UserEntity";

export class UserRepository extends AbstractRepository<User> {
  protected getEntity() {
    return UserModel;
  }

  protected getEntityName() {
    return "User";
  }

  protected convertEntityToModel(entity: User) {
    return entity;
  }

  protected convertModelToEntity(model: User) {
    return model;
  }

  /**
   * TODO: this should be outside.
   *
   */
  async seed() {}

  async findByUsername(username: string) {
    return new Promise<User>((resolve, reject) => {
      this.getEntity().find(
        { username, $limit: 1 },
        (err: unknown, result: User[]) => {
          if (err || !result) {
            reject(err);
          }

          if (result.length < 1) {
            reject(new Error(`${this.getEntityName()} not found`));
          }

          resolve(result[0]);
        },
      );
    });
  }
}
