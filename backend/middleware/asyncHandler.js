/**
 * asyncHandler - Async route handler sarmalayıcı
 *
 * Async controller fonksiyonlarındaki uncaught promise rejections'ı yakalar
 * ve next(err) ile error middleware'e iletir. Böylece her controller'da
 * try/catch yazmak zorunda kalmayız.
 *
 * Kullanım: router.get('/path', asyncHandler(controller.fn))
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
