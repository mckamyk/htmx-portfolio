export const wait = async (duration: number) => {
  return new Promise((res) => {
    setTimeout(res, duration)
  })
}
