import { build } from "./builder";
import { commitAndPushPublish, pullPublish } from "./git";
import { log, pause } from "./util";

await pullPublish().catch(async err => {
    console.log(err)
    log.red("Failed to pull the publish repository.")
    await pause()
    process.exit()
})

await build()
.then(() => {
    log.green("Build and publish finished!");
})
.catch(async err => {
    log.red(`Error: ${err.message}`)
    await pause()
    process.exit()
});

await commitAndPushPublish().catch(async err => {
    console.log(err)
    log.red("Failed to commit and push new changes")
    await pause()
    process.exit()
})

await pause()