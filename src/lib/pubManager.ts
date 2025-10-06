import { loadConfig } from "./config";
import path from "path"
import { STATIC } from "./const";
import { readdirSync } from "fs";
import { prompt, type askQ } from "./prompt";

let publishProfileCache:string | null = null;

export const getPublishProfile = async () => {
    if (!publishProfileCache) publishProfileCache = await selectPublishProfile()
    return publishProfileCache
}

const selectPublishProfile = async () => {
    const config = await loadConfig()
    const pubPath = path.join(config.projectPath, STATIC.pubProfilesPath)
    const files = readdirSync(pubPath, {withFileTypes: true})
    console.log(pubPath)
    for (const file of files) {
        if (path.extname(file.name) !== ".pubxml") continue
        console.log(file.name)
    }
    let a = await prompt("which profile to use? (enter the number)\n")
    console.log(a)
    return ""
}