export const isDefined = <T>(arg: T | undefined): arg is T => {
  return arg !== undefined;
}

export const isNotNull = <T>(arg: T | null): arg is T => {
  return arg !== null
}

export const isArrayGuard = <T>(arg: T[] | T): arg is T[] => {
  return Array.isArray(arg)
}
