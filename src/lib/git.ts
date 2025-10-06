import { loadConfig } from "./config"
import { exec } from "child_process"
import { promisify } from "util"
import { log } from "./logger"

const execAsync = async (command: string) => {
    const {stdout} = await promisify(exec)(command)
    log(stdout)
}

export const pullPublish = async () => {
    const config = await loadConfig()
    const publishDir = config.defaultPublishProfile

    try {
        log.blue("Running git pull on publish...")
        await execAsync(`git -C "${publishDir}" pull`)
        log.green("Git pull successful")
    } catch (err: any) {
        log.red(`Git pull failed: ${err.message} `)
        log.blue("Resetting local changes and force pulling from remote...")

        await execAsync(`git -C "${publishDir}" restore .`)
        await execAsync(`git -C "${publishDir}" clean -df`)
        await execAsync(`git -C "${publishDir}" fetch --all`)
        await execAsync(`git -C "${publishDir}" reset --hard origin/master`)
        log.green("Local repository replaced with remote successfully")
    }
}

const getDate = () => new Date().toLocaleString("fa").toString()
const generateCommitMsg = (author: string) => `${getDate()} - by ${author}`

export const commitAndPushPublish = async () => {
    const config = await loadConfig()
    const publishDir = config.publishPath

    try {
        log.blue("Commiting and pushing new changes to remote...")
        await execAsync(`git -C "${publishDir}" add .`)
        await execAsync(`git -C "${publishDir}" commit -m "${generateCommitMsg(config.author)}"`)
        await execAsync(`git -C "${publishDir}" push origin master`)
        log.green("Commit and push successfull!")
    } catch(e: any) {
        log.red("Error while commit/push new changes")
        log(e)
        log.blue("Reverting changes...")
        await execAsync(`git -C "${publishDir}" restore .`)
        await execAsync(`git -C "${publishDir}" clean -df`)
        throw new Error(e)
    }
}