const Paginate = require("react-paginate");

// react-paginate is CJS (__esModule + default). require() returns the
// namespace; Next/webpack default-import interop sometimes leaves callers
// with that object, which React then tries to invoke → "t is not a function".
module.exports = Paginate.default || Paginate;
