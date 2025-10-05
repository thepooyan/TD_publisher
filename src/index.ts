import { build } from "./builder";
import { loadConfig } from "./config";
import { pause } from "./util";

// build()
//   .then(() => {
//     console.log("Build and publish finished!");
//   })
//   .catch((err) => console.error("Error:", err.message));

let config = await loadConfig()
console.log(config)

// await pause()