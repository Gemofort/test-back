import { Context } from 'koa';
import * as mongoose from 'mongoose';
import Car, { ICar, CarStatus } from '../cars/schemas/car.schema';
import Route, { DeliveryStatus, IRoute } from './schemas/route.schema';
import { carBaseJoiSchema } from 'src/cars/cars.validation';

const { ObjectId } = mongoose.Types;

export class RouteController {
  static async createRoute(ctx: Context) {
    const { departure, arrival, distance, type } = ctx.request.body;

    const route = await (new Route({
      departure,
      arrival,
      distance,
      type,
      status: DeliveryStatus.FREE,
    })).save();

    ctx.status = 201;
    ctx.body = {
      departure,
      arrival,
      type,
      distance,
      status: route.status,
      _id: route._id.toString(),
    };
  }

  static async removeRoute(ctx: Context) {
    const { routeId } = ctx.params;

    const route: any = await Route.findOne({ _id: ObjectId(routeId) }).select('-__v').populate('car');

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    const promisesToExecute: Promise<any>[] = [route.remove()];

    if (route.car) {
      route.car.status = CarStatus.FREE;
      promisesToExecute.push(route.car.save());
    }

    await Promise.all(promisesToExecute);

    ctx.status = 204;
    ctx.body = {};
  }

  static async availableCarsToRoute(ctx: Context) {
    const { routeId } = ctx.params;

    const route: IRoute = (await Route.findOne({ _id: ObjectId(routeId) }).select('-__v')).toObject();

    const cars: ICar[] = (await Car.find({ type: route.type, status: CarStatus.FREE })
    .select('-__v')).map((car) => {
      const newCar = car.toObject();
      newCar._id = car._id.toString();

      return newCar;
    });

    ctx.body = { cars };
  }

  static async setupAvailableCarsToRoute(ctx: Context) {
    const { routeId } = ctx.params;
    const { carId } = ctx.request.body;

    const route: IRoute = (await Route.findOne({ _id: ObjectId(routeId) }).select('-__v')).toObject();

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    const car: ICar = await Car.findOne({ _id: ObjectId(carId), type: route.type, status: CarStatus.FREE }).select('-__v');

    if (!car) {
      ctx.throw(404, 'Car with such id is not available');
    }

    route.car = car._id;
    route.status = DeliveryStatus.PENDING;
    route.startedAt = new Date(Date.now());

    car.status = CarStatus.UNAVAILABLE;

    await Promise.all([route.save(), car.save()]);

    ctx.status = 204;
    ctx.body = {};
  }

  static async updateRoute(ctx: Context) {
    const { routeId } = ctx.params;
    const { departure, arrival, distance, type } = ctx.params;

    const route: IRoute = (await Route.findOne({ _id: ObjectId(routeId) }).select('-__v')).toObject();

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    if (departure) route.departure = departure;
    if (arrival) route.arrival = arrival;
    if (distance) route.distance = distance;
    if (type) route.type = type;

    await route.save();

    ctx.status = 204;
    ctx.body = {};
  }

}
