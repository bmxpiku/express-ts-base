import expressValidator from 'express-joi-validation';

const routeValidator = expressValidator.createValidator({ passError: true });
export default routeValidator;
