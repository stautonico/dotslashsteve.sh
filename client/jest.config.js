const esModules = ["@roxi"].join("|")

module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.svelte$": [
            "svelte-jester",
            {
                "preprocess": true
            }
        ],
        ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
        "^.+\\.js$": "babel-jest",
        "^.+\\.ts$": "ts-jest"
    },
    "moduleFileExtensions":
        [
            "js",
            "ts",
            "svelte"
        ],
    "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    "setupFilesAfterEnv": ["@testing-library/jest-dom/extend-expect"],
    "extensionsToTreatAsEsm": [".svelte"],
    testPathIgnorePatterns: ["dist"],
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
}