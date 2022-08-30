module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended",
        "plugin:jest/recommended"
    ],
    plugins: ["@typescript-eslint", "jest"],
    ignorePatterns: [
        "node_modules",
        "dist",
        "jest.config.ts",
        ".eslintrc.js",
    ],
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn", // or "error"
            {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }
        ],
        "no-redeclare": "off", // We redeclare a lot
        "@typescript-eslint/no-non-null-assertion": "off", // We use these alot during testing to make sure stuff works
        "@typescript-eslint/ban-ts-comment": "off", // Typescript says a lot of stupid shit
        "no-var": "off", // var is required in some places
        "prefer-const": "off", // Not having everything be constants is fine
        "no-async-promise-executor": "off", // I really don't care about this
        "quotes": ["error", "double"],
        "camelcase": ["error", {properties: "always"}],
    },
    "env": {
        "browser": true,
        "jest": true,
        "jest/globals": true
    }
};
