function getUpdateSentences(updateValues) {
  const sentences = [];

  for (let key in updateValues) {
    if (updateValues[key]) {
      let value = updateValues[key];

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
