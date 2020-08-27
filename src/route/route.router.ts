import * as Router from 'koa-joi-router';

import { CarsController } from './route.controller';
import { CarsValidator } from './route.validator';

const carsRouter = Router();

carsRouter.post(
  '/cars',
  CarsValidator.createCar,
  CarsController.createCar,
);

carsRouter.get(
  '/cars/:carId',
  CarsValidator.getCarById,
  CarsController.getCarById,
);

export default carsRouter;
