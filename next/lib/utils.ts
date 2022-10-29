export const truncateEthAddress = (address: string) => {
  const ethAddressPattern = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  const match = address.match(ethAddressPattern);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
