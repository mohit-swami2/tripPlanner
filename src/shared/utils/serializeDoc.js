/**
 * Ensures MongoDB docs serialize cleanly in JSON (aggregation returns raw ObjectIds).
 */
const normalizeMongoDoc = (doc) => {
  if (doc == null) return doc;
  if (Array.isArray(doc)) return doc.map(normalizeMongoDoc);

  if (typeof doc !== 'object') return doc;

  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (plain._id != null) plain._id = String(plain._id);

  return plain;
};

module.exports = { normalizeMongoDoc };
