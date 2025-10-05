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

const getDate = () => new Date().toLocaleString("fa").toString()
const generateCommitMsg = (author: string) => `${getDate()} - by ${author}`

export const commitAndPushPublish = async () => {
    const config = await loadConfig()
    const publishDir = config.publishPath

    try {
        await execAsync(`git -C "${publishDir}" add .`)
        await execAsync(`git -C "${publishDir}" commit -m "${generateCommitMsg("taha")}"`)
        await execAsync(`git -C "${publishDir}" push origin master`)
        log.green("Commit and push successfull!")
    } catch(e: any) {
        log(e)
        log("Reverting changes...")
        await execAsync(`git -C "${publishDir}" restore .`)
        await execAsync(`git -C "${publishDir}" clean -df`)
        throw new Error(e)
    }
}