import { AbstractEntity } from "@/model/AbstractEntity";

export interface AuthenticatorEntity extends AbstractEntity {
  id: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string;

  userId: string;
}
