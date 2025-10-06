import { build } from "./lib/builder";
import { commitAndPushPublish, pullPublish } from "./lib/git";
import { log } from "./lib/logger";
import { getPublishProfile } from "./lib/pubManager";
import { exit, pause, waitForExit } from "./lib/util";

await pullPublish().catch(async err => {
    log.red(err)
    log.red("Failed to pull the publish repository.")
    await waitForExit()
})

await build()
.then(() => {
    log.green("Build and publish finished!");
})
.catch(async err => {
    log.red(err)
    log.red("Failed to build the project")
    await waitForExit()
});

await commitAndPushPublish().catch(async err => {
    log.red(err)
    log.red("Failed to commit and push new changes")
    await waitForExit()
})

log.green("Publish was successful!")
await pause()