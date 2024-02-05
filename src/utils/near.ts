const nearAddressRegex =
  /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;

export const validateNearAddress = (address: string): boolean => {
  if (address.length < 2 || address.length > 64) return false;
  if (!nearAddressRegex.test(address)) return false;
  return true;
};
