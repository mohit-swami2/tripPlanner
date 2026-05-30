const generateCode = async (Model, prefix, field = 'code') => {
  const count = await Model.countDocuments();
  const seq = String(count + 1).padStart(5, '0');
  return `${prefix}-${seq}`;
};

module.exports = { generateCode };
