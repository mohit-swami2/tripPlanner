const replacePlaceholders = (template, data = {}) => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value ?? ''));
  }
  return result;
};

module.exports = { replacePlaceholders };
