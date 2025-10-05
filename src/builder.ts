import { spawn } from "child_process";
import { loadConfig } from "./config";
import path from "path";
import { STATIC } from "./const";


export async function build() {
  const config = await loadConfig()
  const vsDevCmd = path.join(config.vsPath, STATIC.vsDevPath);
  const project = "./TahlildadehMVC/TahlildadehMvc.csproj";
  const profile = "FolderProfile";
  const command = `"${vsDevCmd}" && msbuild "${project}" /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=${profile}`;

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