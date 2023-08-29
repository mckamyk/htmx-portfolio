export const formatWithDecimals = (number: bigint, decimals: number) => {
  const factor = Math.pow(10, decimals);
  return Number(number) / factor
}
