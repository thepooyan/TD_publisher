import chalk from "chalk"

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

type colors = "red" | "green"

const folan = (color: colors) => (msg: string) => {console.log(chalk[color](msg))}

export const log = {
  red: folan("red"),
  green: folan("green"),
}