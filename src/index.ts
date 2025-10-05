import { build } from "./lib/builder";
import { commitAndPushPublish, pullPublish } from "./lib/git";
import { log } from "./lib/logger";
import { pause } from "./lib/util";

await pullPublish().catch(async err => {
    log.red(err)
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
    log.red(err)
    log.red("Failed to commit and push new changes")
    await pause()
    process.exit()
})

await pause()