export const formatWithDecimals = (number: bigint, decimals: number | null) => {
  if (!decimals) return Number(number);
  const factor = Math.pow(10, decimals);
  return Number(number) / factor
}
