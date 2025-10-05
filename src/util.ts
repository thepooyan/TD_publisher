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

type colors = "red" | "green" | "blue"

const colorLogger = (color: colors) => (msg: string) => {console.log(chalk[color](msg))}

type LogFn = {
  (msg: string): void
  red: (msg: string) => void
  green: (msg: string) => void
  blue: (msg: string) => void
}

const generateLog = (): LogFn => {
  const log = ((msg: string) => console.log(msg)) as LogFn
  log.red = colorLogger("red")
  log.green = colorLogger("green")
  log.blue = colorLogger("blue")
  return log
}

export const log = generateLog()