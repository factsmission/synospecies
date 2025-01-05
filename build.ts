import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";
// import { sassPlugin } from "esbuild-sass-plugin";

const SERVE = Deno.args.includes("serve");
const BUILD = Deno.args.includes("build");

const config: esbuild.BuildOptions = {
  entryPoints: ["./src/index.ts", "./src/advanced.ts"],
  outdir: "./dist",
  sourcemap: true,
  bundle: true,
  target: "es2022",
  format: "esm",
  plugins: [
    // sassPlugin({ quietDeps: true, silenceDeprecations: ["color-functions", "global-builtin", "import"] }),
    ...denoPlugins(),
  ],
  lineLimit: 120,
  minify: BUILD ? true : false,
  banner: SERVE
    ? {
      js:
        "new EventSource('/esbuild').addEventListener('change', () => location.reload());",
    }
    : undefined,
};

if (SERVE) {
  const ctx = await esbuild.context(config);
  await ctx.watch();

  const { host, port } = await ctx.serve({
    servedir: "./dist",
  });

  console.log(`Listening at ${host}:${port}`);
} else {
  await esbuild.build(config);
}
