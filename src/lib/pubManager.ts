import { loadConfig } from "./config";
import path from "path"
import { STATIC } from "./const";
import { readdirSync } from "fs";

let publishProfileCache:string | null = null;

export const getPublishProfile = async () => {
    if (!publishProfileCache) publishProfileCache = await selectPublishProfile()
    return publishProfileCache
}

export const selectPublishProfile = async () => {
    const config = await loadConfig()
    const pubPath = path.join(process.cwd(), STATIC.pubProfilesPath)
    const files = readdirSync(pubPath, {withFileTypes: true})
    console.log(pubPath)
    files.forEach(file => {
        console.log(path.extname(file.name))
    })
    return ""
}