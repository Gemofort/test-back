import { Context } from 'koa';
import * as mongoose from 'mongoose';
import Car, { ICar, CarStatus, CarType } from '../cars/schemas/car.schema';
import Route, { DeliveryStatus, IRoute } from './schemas/route.schema';
import calculator, { CalcResponse } from '../helpers/calculator';
import routesRouter from './route.router';

const { ObjectId } = mongoose.Types;

type ObjectId = mongoose.Types.ObjectId;

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

  static async searchRoutes(ctx: Context) {
    const { departure, arrival, type, status, carId, routeId } = ctx.query;

    const searchObject: any = {};

    if (departure) searchObject.departure = { $regex: new RegExp(departure, 'i') };
    if (arrival) searchObject.arrival = { $regex: new RegExp(arrival, 'i') };
    if (type) searchObject.type = type;
    if (status) searchObject.status = status;
    if (carId) searchObject.car = ObjectId(carId);
    if (routeId) searchObject._id = ObjectId(routeId);

    const routes: any[] = (await Route.find(searchObject).select('-__v').populate('car'))
      .map((route: any) => {
        const bufRoute = route.toObject();
        bufRoute._id = route._id.toString();

        if (route.car) {
          bufRoute.car._id = route.car._id.toString();
        }

        return bufRoute;
      });

    ctx.body = { routes };
  }

  static async getRouteById(ctx: Context) {
    const { routeId } = ctx.params;

    const route: any = (await Route.findOne({ _id: ObjectId(routeId) }).select('-__v').populate('car')).toObject();

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }
    route._id = route._id.toString();

    console.log(route);

    if (route.car) {
      route.car._id = route.car._id.toString();
    }

    console.log(route);

    ctx.body = { ...route };
  }

  static async setupAvailableCarsToRoute(ctx: Context) {
    const { routeId } = ctx.params;
    const { carId } = ctx.request.body;

    const route: IRoute = await Route.findOne({ _id: ObjectId(routeId) }).select('-__v');

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    const car: ICar = await Car.findOne({ _id: ObjectId(carId), type: route.type, status: CarStatus.FREE }).select('-__v');

    if (!car) {
      ctx.throw(404, 'Car with such id is not available');
    }

    if (route.car) {
      ctx.throw(400, 'Another car is already assigned to route');
    }

    route.car = car._id;
    route.status = DeliveryStatus.PENDING;
    route.startedAt = new Date(Date.now());

    car.status = CarStatus.UNAVAILABLE;

    await Promise.all([route.save(), car.save()]);

    ctx.status = 204;
    ctx.body = {};
  }

  static async submitRoute(ctx: Context) {
    const { routeId, carId } = ctx.params;

    const route: any = await Route.findOne({ _id: ObjectId(routeId) }).populate('car').select('-__v');

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    if (!route.car || route.car._id.toString() !== carId) {
      ctx.throw(404, 'Car with such id is not submitted for this route');
    }

    const calculation: CalcResponse = calculator(route, route.car);

    const car = route.car;

    route.earnings = calculation.route.earnings;
    route.status = calculation.route.status;

    car.mileage = calculation.car.mileage;
    car.status = calculation.car.status;

    await Promise.all([route.save(), car.save()]);

    ctx.status = 204;
    ctx.body = {};
  }

  static async updateRoute(ctx: Context) {
    const { routeId } = ctx.params;
    const { departure, arrival, distance, type } = ctx.request.body;

    const route: IRoute = await Route.findOne({ _id: ObjectId(routeId) }).select('-__v');

    if (!route) {
      ctx.throw(404, 'Route with such id does not exist');
    }

    if (!route.car && route.status === DeliveryStatus.PENDING) {
      ctx.throw(400, 'You cannot update route while it is in pending status');
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
