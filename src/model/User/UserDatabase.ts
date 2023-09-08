interface UserEntity {
  id: string;
  username: string;
  currentChallenge?: string;
}

export const userDatabase = new Map<string, UserEntity>();
