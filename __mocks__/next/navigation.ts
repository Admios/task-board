const push = jest.fn();
export const useRouter = () => ({ push });
export const redirect = jest.fn();
export const navigation = { push, redirect };
