export default ace => (req, res, next) => {
  req.ace = ace.httpClient(req);
  next();
};
