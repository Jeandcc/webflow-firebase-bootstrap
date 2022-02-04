module.exports = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/src/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["<rootDir>/.jest/setEnv.ts"],
  moduleNameMapper: {
    "@api/(.*)": "<rootDir>/src/api/$1",
    "@models/(.*)": "<rootDir>/src/models/$1",
    "@services/(.*)": "<rootDir>/src/services/$1",
    "@util/(.*)": "<rootDir>/src/util/$1",
    "@common/(.*)": "<rootDir>/src/common/$1",
    "@templates/(.*)": "<rootDir>/src/templates/$1",
    "@locales/(.*)": "<rootDir>/src/locales/$1",
  },
};
