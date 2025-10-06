import readline from "readline";

export type askQ = (q: string) => Promise<string>

export const prompt = async (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => rl.question(question, resolve))
  }

  let ans = await askQuestion(question + "\n")

  rl.close()

  return ans
}