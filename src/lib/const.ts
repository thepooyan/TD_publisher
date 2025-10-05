import "dotenv/config"
export const STATIC = {
    appname: "publisher",
    configFile: "config.json",
    vsDevPath: "Common7\\Tools\\VsDevCmd.bat"
}
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = !isDevelopment;