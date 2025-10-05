import { isDevelopment } from "./const"

export async function pause(msg: string = "Press any key to continue...") {
  if (isDevelopment) return
  return new Promise<void>(resolve => {
    process.stdin.resume()
    process.stdout.write(msg)
    process.stdin.once("data", () => {
      process.stdin.pause()
      resolve()
    })
  })
}

export const exit = () => {
  if (isDevelopment) throw new Error("Trigger restart")
  process.exit()
}

export const waitForExit = async (msg?: string) => {
  await pause(msg)
  exit()
}