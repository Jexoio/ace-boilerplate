import createContainer from '../ioc';

export default (req, res, next) => {
  req.ioc = createContainer();
  next();
};
