import { loadConfig } from "./config"
import { exec } from "child_process"
import { promisify } from "util"
import { log } from "./util"

const execAsync = promisify(exec)

export const pullPublish = async () => {
    const config = await loadConfig()
    const publishDir = config.publishPath

    try {
        await execAsync(`git -C "${publishDir}" pull`)
        console.log("Git pull successful")
    } catch (err: any) {
        console.error("Git pull failed:", err.message)
        console.log("Resetting local changes and force pulling from remote...")

        await execAsync(`git -C "${publishDir}" restore .`)
        await execAsync(`git -C "${publishDir}" clean -df`)
        await execAsync(`git -C "${publishDir}" fetch --all`)
        await execAsync(`git -C "${publishDir}" reset --hard origin/master`)
        console.log("Local repository replaced with remote successfully")
    }
}

export const commitAndPushPublish = async () => {
    const config = await loadConfig()
    const publishDir = config.publishPath

    try {
        await execAsync(`git -C "${publishDir}" commit -m "test"`)
        log.green("Git pull successful")
    } catch(e: any) {
        log("Reverting changes...")
        throw new Error(e)
    }
}