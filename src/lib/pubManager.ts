import { loadConfig } from "./config";
import { XMLParser } from "fast-xml-parser"
import {log} from "./logger"
import fs, { existsSync } from "fs"
import path from "path"
import { STATIC } from "./const";
import { readdirSync } from "fs";
import { prompt } from "./prompt";
import z from "zod";
import { execSync } from "child_process";

let publishProfileCache:returnType | null = null;

type returnType = {
    profileName: string
    publishFolder: string
}

export const getPublishProfile = async () => {
    if (!publishProfileCache) publishProfileCache = await selectPublishProfile()
    return publishProfileCache
}

const schema = z.object({
  Project: z.object({
    PropertyGroup: z.object({
      PublishUrl: z.string(),
    })
  })
})

const parseFileContent = (content: string) => {
    try {
        let xmlParsed = new XMLParser().parse(content)
        let schemaParsed = schema.parse(xmlParsed)
        let dir = schemaParsed.Project.PropertyGroup.PublishUrl
        if (!hasGit(dir)) return null
        return dir
    } catch {
        return null
    }
}

const selectPublishProfile = async () => {
    const config = await loadConfig()
    const pubPath = path.join(config.projectPath, STATIC.pubProfilesPath)
    const files = readdirSync(pubPath, {withFileTypes: true})
    const profilesMap = new Map<number, string>()
    let index = 1
    for (const file of files) {
        if (path.extname(file.name) !== ".pubxml") continue
        log(`${index}: ${file.name}`)
        const fullPath = path.join(pubPath, file.name)
        profilesMap.set(index, fullPath)
        index++;
    }
    let targetProfile = null
    let publishFolder = null
    do {
        let res = await prompt("which profile to use? (enter the number)")
        targetProfile = profilesMap.get(parseInt(res))
        if (!targetProfile) {
            log.red("Invalid input.")
            continue
        }
        const fileContent = fs.readFileSync(targetProfile, "utf-8")
        publishFolder = parseFileContent(fileContent)
        if (!publishFolder) log.red("Selected profile has no publish folder or the publish folder has no git")
    } while(!targetProfile || !publishFolder)

    return {
        profileName: path.basename(targetProfile),
        publishFolder: publishFolder
    }
}

const hasGit = (fullPath: string): boolean => {
    if (!existsSync(fullPath)) return false;
    try {
      execSync("git rev-parse --is-inside-work-tree", { cwd: fullPath, stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  };