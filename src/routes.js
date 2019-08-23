import { Router } from 'express';
import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', LoginController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
