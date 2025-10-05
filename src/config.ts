import fs from "fs";
import path from "path";
import readline from "readline";
import { STATIC } from "./const";
import { log } from "./util";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export interface config {
    vsPath: string;
    publishPath: string;
    author: string;
}

let cacheConfig:config | null = null;

export async function loadConfig() {
  if (cacheConfig !== null) return cacheConfig
  const appDataPath = process.env.APPDATA || path.join(process.env.HOME || ".", ".config");
  const configDir = path.join(appDataPath, STATIC.appname);
  const configPath = path.join(configDir, STATIC.configFile);

  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf-8");
    try {
      const config = JSON.parse(content) as config;
      log.green("Config loaded:");
      console.log(config)
      rl.close();
      cacheConfig = config;
      return config;
    } catch {
        throw new Error(`Invalid config file: ${configPath}`)
    }
  }

  const getVsPath = async () => {
    const vsPath = await askQuestion(`Please Enter your visual studio installation path (example: C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise)\n => `);
    const vsDev = path.join(vsPath , STATIC.vsDevPath)
    if (!fs.existsSync(vsDev)) {
        log.red("Wrong address. try again.")
        return await getVsPath()
    }
    return vsPath
  }
  const getPublishPath = async () => {
    const pubPath = await askQuestion(`\nPlease Enter your publish folder address: \n`);
    if (!fs.existsSync(pubPath)) {
        log.red("Folder does not exist! try again.")
        return await getPublishPath()
    }
    return pubPath
  }

  const vsPath = await getVsPath()
  const publishPath = await getPublishPath()
  const author = await askQuestion("Please enter your name: ")
  const newConfig:config = { vsPath , publishPath, author };

  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  log.green("Config saved:");
  console.log(newConfig)
  rl.close();
  cacheConfig = newConfig;
  return newConfig;
}