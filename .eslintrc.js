module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-unused-vars": "none",
    indent: ["error", 2],
  },
};
