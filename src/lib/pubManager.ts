import { loadConfig } from "./config";
import path from "path"
import { STATIC } from "./const";
import { Dirent, readdirSync } from "fs";
import { prompt, type askQ } from "./prompt";
import { log } from "console";

let publishProfileCache:string | null = null;

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
    let trg = null
    do {
        let res = await prompt("which profile to use? (enter the number)")
        trg = profilesMap.get(parseInt(res))
    } while(!trg)
    console.log(trg)
        
    return ""
}