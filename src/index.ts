import { spawn } from "child_process";
import { pause } from "./util";

const vsDevCmd = `C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\Tools\\VsDevCmd.bat`;
const project = "./TahlildadehMVC/TahlildadehMvc.csproj";
const profile = "FolderProfile";
const command = `"${vsDevCmd}" && msbuild "${project}" /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=${profile}`;

async function run() {
  await new Promise<void>((resolve, reject) => {
    const cmd = spawn(command, {
      stdio: "inherit",
      shell: true
    });

    cmd.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Process exited with code ${code}`));
    });

    cmd.on("error", (err) => {
      reject(err);
    });
  });
}

run()
  .then(() => {
    console.log("Build and publish finished!");
  })
  .catch((err) => console.error("Error:", err.message));

await pause()