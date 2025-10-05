export async function pause(msg: string = "Press any key to continue...") {
  return new Promise<void>(resolve => {
    process.stdin.resume()
    process.stdout.write(msg)
    process.stdin.once("data", () => {
      process.stdin.pause()
      resolve()
    })
  })
}