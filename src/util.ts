export async function pause() {
  return new Promise<void>(resolve => {
    process.stdin.resume()
    process.stdout.write("Press Enter to continue...")
    process.stdin.once("data", () => {
      process.stdin.pause()
      resolve()
    })
  })
}