export const trimAddress = (address: string) =>
  address.slice(0, 6) + "..." + address.slice(-4);

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}
