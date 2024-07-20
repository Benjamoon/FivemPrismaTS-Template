import { Glob } from "bun";

const sourceDirectory = "./src";

const build = async () => {
    
    const clientFiles = new Glob(sourceDirectory + "/**/*.client.ts");
    const serverFiles = new Glob(sourceDirectory + "/**/*.server.ts");
    
    const clientEntryPoint = "./src/index.client.ts";
    const serverEntryPoint = "./src/index.server.ts";
    
    const clientBuildResult = await Bun.build({
        entrypoints: [clientEntryPoint],
        outdir: "./dist/client",
        target: "browser",
        minify: true,
        sourcemap: "inline",
        watch: true
    })
    
    console.log("Client Build:", clientBuildResult.success);
    
    if (!clientBuildResult.success) {
        for (const error of clientBuildResult.logs) {
            console.error(error);
        }
    }
    
    const serverBuildResult = await Bun.build({
        entrypoints: [serverEntryPoint],
        outdir: "./dist/server",
        target: "node",
        minify: true,
        sourcemap: "inline",
        watch: true
    })
    
    console.log("Server Build:", serverBuildResult.success);
    
    if (!serverBuildResult.success) {
        for (const error of serverBuildResult.logs) {
            console.error(error);
        }
    }
}


// Watch for changes in src directory
import { watch } from "fs";

const watchMe = async () => {
    const watcher = watch("./src", { recursive: true });
    watcher.on("change", async (path) => {
        console.log("File changed:", path);
        build();
    });
}

build();
watchMe();