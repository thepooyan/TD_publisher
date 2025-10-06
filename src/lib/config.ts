import fs from "fs";
import path from "path";
import { STATIC } from "./const";
import { log } from "./logger";
import z, { string } from "zod";
import { waitForExit } from "./util";
import { prompt } from "./prompt";
import { getPublishProfile } from "./pubManager";

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
  defaultPublishProfile: {
    profileName: string().nonempty(),
    publishFolder: string().nonempty()
  }
})
export type config = z.infer<typeof configSchema>

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

const makeNewConfig = async (): Promise<config> => {
  const getVsPath = async (): Promise<string> => {
    while (true) {
      const vsPath = await prompt(
        `Please Enter your Visual Studio installation path (example: C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise)`
      )
      const vsDev = path.join(vsPath, STATIC.vsDevPath)
      if (fs.existsSync(vsDev)) return vsPath
      log.red("Wrong address. Try again.")
    }
  }
  const getProjectPath = async (): Promise<string> => {
    while (true) {
      let prPath = await prompt( `Please enter your project path (. for current directory): `)
      if (prPath === ".") prPath = process.cwd()
      if (verifyProjectPath(prPath)) return prPath
      log.red("Wrong address. Try again.")
    }
  }

  const vsPath = await getVsPath()
  const author = await prompt("Please enter your name: ")
  const projectPath = await getProjectPath()
  const defaultPublishProfile  = await getPublishProfile(projectPath)

  return { vsPath, author, projectPath, defaultPublishProfile }
}

const regenerateConfig = async () => {
  try {
    fs.rmSync(configPath)
    return await makeNewConfig()
  } catch {
    log.red("Error while deleting config file. please remove it manually and start the program again.")
    return await waitForExit()
  }
}

const readConfig = async () => {
  const content = fs.readFileSync(configPath, "utf-8");
  try {
    const config = JSON.parse(content);
    let parsed = configSchema.parse(config)
    log.green("Config loaded:");
    console.log(config)
    cacheConfig = parsed;
    return parsed;
  } catch {
    log.red(`Invalid config file: ${configPath}`)
    log.blue("regenerating config...")
    return await regenerateConfig()
  }
}

export async function loadConfig() {
  if (cacheConfig !== null) return cacheConfig

  if (fs.existsSync(configPath)) {
    return await readConfig()
  } else {
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    const newConfig = await makeNewConfig()
    saveConfig(newConfig)
    cacheConfig = newConfig;
    return newConfig;
  }
}

export const verifyProjectPath = (projectPath: string) => {
  if (!fs.existsSync(projectPath)) return false
  let pubPath = path.join(projectPath, STATIC.pubProfilesPath)
  if (!fs.existsSync(pubPath)) return false
  return true
}