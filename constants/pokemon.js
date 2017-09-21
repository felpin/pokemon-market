exports.NAME_LENGTH = 255;

exports.PRICE_PRECISION = 10;
exports.PRICE_SCALE = 2;
exports.PRICE_MAX_VALUE =
  ((10 ** ((1 + this.PRICE_PRECISION) - this.PRICE_SCALE)) - 1) + (1 - (10 ** -this.PRICE_SCALE));

exports.STOCK_MAX_VALUE = Number.MAX_SAFE_INTEGER;
