let languages = require("language-list")();

const Langs = languages.getData().map((v) => ({
  label: v.language,
  value: v.code,
}));

export default Langs;
