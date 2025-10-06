import { loadConfig } from "./config";
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import path from "path"
import { STATIC } from "./const";
import { readdirSync } from "fs";
import { prompt } from "./prompt";
import { log } from "console";

let publishProfileCache:returnType | null = null;

type returnType = {
    profileName: string
    publishFolder: string
}

export const getPublishProfile = async () => {
    if (!publishProfileCache) publishProfileCache = await selectPublishProfile()
    return publishProfileCache
}

const selectPublishProfile = async () => {
    const config = await loadConfig()
    const pubPath = path.join(config.projectPath, STATIC.pubProfilesPath)
    const files = readdirSync(pubPath, {withFileTypes: true})
    const profilesMap = new Map<number, string>()
    let index = 1
    for (const file of files) {
        if (path.extname(file.name) !== ".pubxml") continue
        log(`${index++}: ${file.name}`)
        const fullPath = path.join(pubPath, file.name)
        profilesMap.set(index, fullPath)
    }
    let targetProfile = null
    do {
        let res = await prompt("which profile to use? (enter the number)")
        targetProfile = profilesMap.get(parseInt(res))
    } while(!targetProfile)
        
    const fileContent = fs.readFileSync(targetProfile, "utf-8")
    let parsed = new XMLParser().parse(fileContent)
    const publishFolder = parsed.Project.PropertyGroup.PublishUrl as string

    return {
        profileName: path.basename(targetProfile),
        publishFolder: publishFolder
    }
}