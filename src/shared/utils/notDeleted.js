/** Match documents that are not soft-deleted (includes legacy docs without isDeleted). */
const notDeleted = { isDeleted: { $ne: true } };

module.exports = { notDeleted };
