module.exports = {
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    "moduleFileExtensions":
        [
            "js",
            "ts"
        ],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    testPathIgnorePatterns: ["dist"],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    // moduleNameMapper: {
    //     'src/(.*)': '<rootDir>/src/$1',
    //     'tests/(.*)': '<rootDir>/tests/$1'
    // }
}