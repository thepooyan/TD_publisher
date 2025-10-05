import { build } from "./builder";
import { pause } from "./util";

build()
  .then(() => {
    console.log("Build and publish finished!");
  })
  .catch((err) => console.error("Error:", err.message));


await pause()