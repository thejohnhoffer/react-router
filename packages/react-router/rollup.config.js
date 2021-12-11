import babel from "rollup-plugin-babel";
import prettier from "rollup-plugin-prettier";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

const PRETTY = !!process.env.PRETTY;

function createBanner(libraryName, version) {
  return `/**
 * ${libraryName} v${version}
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */`;
}

function getVersion(sourceDir) {
  return require(`./${sourceDir}/package.json`).version;
}

function reactRouter() {
  const SOURCE_DIR = ".";
  const OUTPUT_DIR = "build";
  const version = getVersion(SOURCE_DIR);

  // JS modules for bundlers
  const modules = [
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/index.js`,
        format: "esm",
        sourcemap: !PRETTY,
        banner: createBanner("React Router", version)
      },
      external: ["history", "react"],
      plugins: [
        babel({
          exclude: /node_modules/,
          presets: [
            ["@babel/preset-env", { loose: true }],
            "@babel/preset-react",
            "@babel/preset-typescript"
          ],
          plugins: ["babel-plugin-dev-expression"],
          extensions: [".ts", ".tsx"]
        })
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  return [...modules];
}

export default function rollup(options) {
  let builds = [
    ...reactRouter(options),
  ];

  return builds;
}
