import * as Router from 'koa-joi-router';

import { CarsController } from './cars.controller';
import { CarsValidator } from './cars.validation';

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
