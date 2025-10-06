import fs from "fs";
import path from "path";
import readline from "readline";
import { STATIC } from "./const";
import { log } from "./logger";
import z, { string } from "zod";
import { waitForExit } from "./util";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

const getConfigPath = () => {
  const appDataPath = process.env.APPDATA || path.join(process.env.HOME || ".", ".config");
  const configDir = path.join(appDataPath, STATIC.appname);
  const configPath = path.join(configDir, STATIC.configFile);
  return {configDir, configPath}
}

let cacheConfig:config | null = null;

const {configPath, configDir} = getConfigPath()

const configSchema = z.object({
  vsPath: string().nonempty(),
  author: string().nonempty(),
  projectPath: string().nonempty(),
})
type config = z.infer<typeof configSchema>

export const parseConfig = (config: any) => {
  return configSchema.parse(config)
}

export async function loadConfig() {
  if (cacheConfig !== null) return cacheConfig

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf-8");
    try {
      const config = JSON.parse(content);
      log.green("Config loaded:");
      console.log(config)
      rl.close();
      let parsed = parseConfig(config)
      cacheConfig = parsed;
      return parsed;
    } catch {
        log.red(`Invalid config file: ${configPath}`)
        log.blue("regenerating config...")
        return await regenerateConfig()
    }
  } else {
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    const newConfig = await makeNewConfig()
    saveConfig(newConfig)
    rl.close();
    cacheConfig = newConfig;
    return newConfig;
  }
}

const saveConfig = (config: config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    log.green("Config saved:");
    console.log(config)
  } catch {
    log.red(`Failed to save config file: ${configPath}`)
    waitForExit()
  }
}

const makeNewConfig = async () => {
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
  const author = await askQuestion("Please enter your name: ")
  const projectPath = await askQuestion("Please enter your project path: (. for current directory)")
  const newConfig:config = { vsPath , author, projectPath };
  return newConfig
}

const regenerateConfig = async () => {
  try {
    const {configPath} = getConfigPath()
    fs.rmSync(configPath)
    return await makeNewConfig()
  } catch {
    log.red("Error while deleting config file. please remove it manually and start the program again.")
    return await waitForExit()
  }
}