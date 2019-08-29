import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/login', LoginController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
export default routes;
