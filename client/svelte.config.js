const preprocess = require("svelte-preprocess");

const config = {
  preprocess: [preprocess({
    scss: {
      "prependData": "@import \"src/styles/global.scss\";"
    }
  })]
};

module.exports = config;
