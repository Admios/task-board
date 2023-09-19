export interface AuthenticatorEntity {
  id: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string;

  userId: string;
}
