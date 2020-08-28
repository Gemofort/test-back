import { IRoute, DeliveryStatus } from '../route/schemas/route.schema';
import { ICar, CarType, CarStatus } from '../cars/schemas/car.schema';

export type CalcResponse = {
  route: {
    earnings: number,
    status: DeliveryStatus,
  },
  car: {
    mileage: number,
    status: CarStatus,
  },
};

export default (route: IRoute, car: ICar): CalcResponse => {
  let multiplier: number;

  switch (car.type) {
    case CarType.TRUCK:
      multiplier = 2.25;

    case CarType.PICKUP_TRUCK:
      multiplier = 1.50;

    case CarType.CROSSOVER:
      multiplier = 1.1;

    default:
      multiplier = 1;
  }

  const earnings: number = route.distance * multiplier;

  return {
    route: {
      earnings,
      status: DeliveryStatus.DONE,
    },
    car: {
      mileage: car.mileage + route.distance,
      status: CarStatus.FREE,
    },
  };
};
