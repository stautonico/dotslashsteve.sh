/**
 * Babel will compile modern JavaScript down to a format compatible with older browsers, but it will also increase your
 * final bundle size and build speed. Edit the `browserslist` property in the package.json file to define which
 * browsers Babel should target.
 *
 * Browserslist documentation: https://github.com/browserslist/browserslist#browserslist-
 */
const useBabel = false;

/**
 * Change this to `true` to generate source maps alongside your production bundle. This is useful for debugging, but
 * will increase total bundle size and expose your source code.
 */
const sourceMapsInProduction = false;

/*********************************************************************************************************************/
/**********                                              Vite                                               **********/
/*********************************************************************************************************************/

import {defineConfig, UserConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
// @ts-ignore
import path from 'path';
import sveltePreprocess from 'svelte-preprocess';
import legacy from '@vitejs/plugin-legacy';
// @ts-ignore
import autoprefixer from 'autoprefixer';
// @ts-ignore
import pkg from './package.json';
// @ts-ignore
import tsconfig from './tsconfig.json';

const production = process.env.NODE_ENV === 'production';
const config = <UserConfig>defineConfig({
    plugins: [
        svelte({
            emitCss: production,
            preprocess: sveltePreprocess(
                // {
                //     postcss: {
                //         plugins: [
                //             require("tailwindcss"),
                //             require("autoprefixer"),
                //         ]
                //     }
                // }
            ),
            compilerOptions: {
                dev: !production,
            },

            // @ts-ignore This is temporary until the type definitions are fixed!
            hot: !production
        }),
    ],
    server: {
        host: 'localhost',
        // host: '0.0.0.0',
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000/api',
                // target: 'http://localhost:8000/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        },
        fs: {
            allow: ["..", "src"]
        }
    },
    build: {
        sourcemap: sourceMapsInProduction,
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer(),

            ]
        },
        preprocessorOptions: {
            scss: {
                additionalData: "@import \"src/styles/variables.scss\";"
            }
        }
    }
});

// Babel
if (useBabel) {
    config.plugins.unshift(
        legacy({
            targets: pkg.browserslist
        })
    );
}

// Load path aliases from the tsconfig.json file
const aliases = tsconfig.compilerOptions.paths;

for (const alias in aliases) {
    const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p));

    // Our tsconfig uses glob path formats, whereas webpack just wants directories
    // We'll need to transform the glob format into a format acceptable to webpack

    const wpAlias = alias.replace(/([\\/])\*$/, '');
    const wpPaths = paths.map((p: string) => p.replace(/([\\/])\*$/, ''));

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    if (config.resolve && config.resolve.alias && !(wpAlias in config.resolve.alias)) {
        config.resolve.alias[wpAlias] = wpPaths.length > 1 ? wpPaths : wpPaths[0];
    }
}

export default config;
