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

carsRouter.get(
  '/cars',
  CarsValidator.searchCars,
  CarsController.searchCars,
);

carsRouter.delete(
  '/cars/:carId',
  CarsValidator.deleteCar,
  CarsController.deleteCar,
);

carsRouter.put(
  '/cars/:carId',
  CarsValidator.updateCar,
  CarsController.updateCar,
);

export default carsRouter;
