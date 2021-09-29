const preprocess = require("svelte-preprocess");

const config = {
  preprocess: [preprocess({
    scss: {
      "prependData": "@import \"src/styles/app.scss\";"
    }
  })]
};

module.exports = config;
