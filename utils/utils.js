function getInsertSentences(insertValues) {
  const sentences = [];

  for (let key in insertValues) {
    if (insertValues[key]) {
      let value = insertValues[key];

      if (typeof value === 'string') {
        sentences.push(`"${value}"`);
      } else {
        sentences.push(`${value}`);
      }
    }
  }

  return sentences;
}

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

module.exports = { getInsertSentences, getUpdateSentences };
