export const generateRegistrationOptions = jest.fn().mockResolvedValue({
  options: {},
});
export const generateAuthenticationOptions = jest.fn().mockResolvedValue({
  options: {},
});
export const verifyRegistration = jest.fn().mockResolvedValue({
  verification: { verified: true },
});
export const verifyAuthentication = jest.fn().mockResolvedValue({
  verification: { verified: true },
});
