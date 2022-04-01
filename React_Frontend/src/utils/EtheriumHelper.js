export function getEthereumProvider() {
  const { ethereum } = window;
  if (ethereum) return ethereum;

  return undefined;
}