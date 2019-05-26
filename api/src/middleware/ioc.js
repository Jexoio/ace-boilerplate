import getContainer from '../ioc';

export default () => {
  const container = getContainer();
  return (req, res, next) => {
    req.ioc = container;
    next();
  };
};
