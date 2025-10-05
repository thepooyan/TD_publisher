import fs from "fs";
import path from "path";
import readline from "readline";
import { STATIC } from "./const";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export interface config {
    vsPath: string;
}

export async function loadConfig() {
  const appDataPath = process.env.APPDATA || path.join(process.env.HOME || ".", ".config");
  const configDir = path.join(appDataPath, STATIC.appname);
  const configPath = path.join(configDir, STATIC.configFile);

  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf-8");
    try {
      const config = JSON.parse(content) as config;
      console.log("Config loaded:", config);
      rl.close();
      return config;
    } catch {
        throw new Error(`Invalid config file: ${configPath}`)
    }
  }

  const getVsPath = async () => {
    const vsPath = await askQuestion(`Please Enter your visual studio installation path (example: C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise)\n => `);
    const vsDev = path.join(vsPath , STATIC.vsDevPath)
    if (!fs.existsSync(vsDev)) {
        console.log("Wrong address. try again.")
        return await getVsPath()
    }
    return vsPath
  }

  const vsPath = await getVsPath()
  const newConfig = { vsPath } as config;
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  console.log("Config saved:", newConfig);
  rl.close();
  return newConfig;
}