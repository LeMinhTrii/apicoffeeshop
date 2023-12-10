const crypto = require("crypto");

const hash = (data) => {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
};

const compare = (hash1, hash2) => {
    const buffer1 = Buffer.from(hash1, "hex");
    const buffer2 = Buffer.from(hash2, "hex");
    return crypto.timingSafeEqual(buffer1, buffer2);
};
module.exports = {
    hash,
    compare,
};