import babel from "rollup-plugin-babel";
import prettier from "rollup-plugin-prettier";

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

function reactRouterNative() {
  const SOURCE_DIR = ".";
  const OUTPUT_DIR = "build";
  const version = getVersion(SOURCE_DIR);

  const modules = [
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/index.js`,
        format: "esm",
        sourcemap: !PRETTY,
        banner: createBanner("React Router Native", version)
      },
      external: [
        "@babel/runtime/helpers/esm/extends",
        "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose",
        "@ungap/url-search-params",
        "history",
        "react",
        "react-native",
        "react-router"
      ],
      plugins: [
        babel({
          exclude: /node_modules/,
          runtimeHelpers: true,
          presets: [
            [
              "module:metro-react-native-babel-preset",
              {
                disableImportExportTransform: true,
                enableBabelRuntime: false
              }
            ],
            "@babel/preset-typescript"
          ],
          plugins: ["babel-plugin-dev-expression"],
          extensions: [".ts", ".tsx"]
        })
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  return modules;
}

export default function rollup(options) {
  let builds = [
    ...reactRouterNative(options)
  ];

  return builds;
}
