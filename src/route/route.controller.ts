import { Context } from 'koa';
import * as mongoose from 'mongoose';
import Car, { ICar } from '../cars/schemas/car.schema';

const { ObjectId } = mongoose.Types;

export class CarsController {
  static async createCar(ctx: Context) {
    const { numberPlate, type, modelType, soldAt, mileage, status } = ctx.request.body;

    const car = await (new Car({
      numberPlate,
      type,
      modelType,
      mileage,
      status,
      soldAt: new Date(soldAt),
    })).save();

    ctx.status = 201;
    ctx.body = {
      numberPlate,
      type,
      modelType,
      mileage,
      status,
      _id: car._id.toString(),
      soldAt: car.soldAt,
    };
  }

  static async getCarById(ctx: Context) {
    const { carId } = ctx.params;

    const car: ICar = (await Car.findOne({ _id: ObjectId(carId) }).select('-__v')).toObject();
    car._id = car._id.toString();

    if (!car) {
      ctx.throw(404, 'Car with such id does not exist');
    }

    ctx.body = { ...car };
  }
}
