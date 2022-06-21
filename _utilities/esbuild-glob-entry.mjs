import { build } from "esbuild";
import glob from "tiny-glob";
import dotenv from 'dotenv';
dotenv.config()

const source = "course-source";
const publish = "course-publish";
// const dev = process.env.NODE_ENV !== "production";

// https://github.com/igoradamenko/esbuild-plugin-alias
(async () => {
  let entryPoints = await glob(`${source}/**/*.js`);

  console.log(entryPoints);

  await build({
    entryPoints,
    nodePaths: [`${source}/_shared/_components/`],
    bundle: true,
    minify: true,
    outdir: publish,
    watch: false
  });
})();