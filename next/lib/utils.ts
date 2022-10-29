export const truncateEthAddress = (address: string) => {
  const ethAddressPattern = /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/;

  const match = address.match(ethAddressPattern);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
