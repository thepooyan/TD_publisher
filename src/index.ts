import { build } from "./builder";
import { commitAndPushPublish, pullPublish } from "./git";
import { log, pause } from "./util";

await pullPublish().catch(err => {
    console.log(err)
    log.red("Failed to pull the publish repository.")
    process.exit()
})

await commitAndPushPublish().catch(err => {
    console.log(err)
    log.red("Failed to commit and push new changes")
    process.exit()
})

build()
  .then(() => {
    log.green("Build and publish finished!");
  })
  .catch((err) => log.red(`Error: ${err.message}`));


// await pause()