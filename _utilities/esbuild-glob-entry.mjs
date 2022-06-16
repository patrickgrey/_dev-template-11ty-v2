import { build } from "esbuild";
import glob from "tiny-glob";
import dotenv from 'dotenv';
dotenv.config()

const source = "course-source";
const publish = "course-publish";
const dev = process.env.NODE_ENV !== "production";

(async () => {
  let entryPoints = await glob(`${source}/**/*.js`);
  await build({
    entryPoints,
    nodePaths: dev ? [`${source}/_shared`] : [`${source}/_shared/_components`],
    bundle: true,
    minify: true,
    outdir: publish,
    watch: dev
  });
})();