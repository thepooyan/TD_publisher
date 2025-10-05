import { build } from "./builder";
import { pullPublish } from "./git";
import { pause } from "./util";

await pullPublish().catch(err => {
    console.log(err)
    console.log("Failed to pull the publish repository.")
    process.exit()
})

build()
  .then(() => {
    console.log("Build and publish finished!");
  })
  .catch((err) => console.error("Error:", err.message));


// await pause()