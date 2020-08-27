import { Context } from 'koa';
import * as mongoose from 'mongoose';
import Car, { ICar, CarStatus } from '../cars/schemas/car.schema';
import Route, { DeliveryStatus, IRoute } from './schemas/route.schema';

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

    const route: IRoute = await Route.findOne({ _id: ObjectId(routeId) }).select('-__v');

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    await route.remove();

    ctx.status = 204;
    ctx.body = {};
  }

  static async availableCarsToRoute(ctx: Context) {
    const { routeId } = ctx.params;

    const route: IRoute = (await Route.findOne({ _id: ObjectId(routeId) }).select('-__v')).toObject();

    const cars: ICar[] = (await Car.find({ type: route.type, status: CarStatus.FREE })
    .select('-__v')).map((car) => {
      const newCar = Object.assign(car.toObject(), {});
      newCar._id = car._id.toString();

      return newCar;
    });

    ctx.body = { cars };
  }
}
