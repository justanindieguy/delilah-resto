function getUpdateSentences(updateParams) {
  const sentences = [];

  for (let key in updateParams) {
    if (updateParams[key]) {
      let value = updateParams[key];

      if (typeof value === 'string') {
        sentences.push(`${key}="${value}"`);
      } else {
        sentences.push(`${key}=${value}`);
      }
    }
  }

  return sentences;
}

module.exports = { getUpdateSentences };
