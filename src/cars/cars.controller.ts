import { Context } from 'koa';
import * as mongoose from 'mongoose';
import Car, { ICar, CarStatus, CarType } from './schemas/car.schema';

const { ObjectId } = mongoose.Types;

export class CarsController {
  static async createCar(ctx: Context) {
    const { numberPlate, type, modelType, soldAt, mileage } = ctx.request.body;

    const car = await (new Car({
      numberPlate,
      type,
      modelType,
      mileage,
      status: CarStatus.FREE,
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

  static async searchCars(ctx: Context) {
    ctx.body = {};
  }

  static async deleteCar(ctx: Context) {
    const { carId } = ctx.params;

    const car: ICar = await Car.findOne({ _id: ObjectId(carId) }).select('-__v');

    if (!car) {
      ctx.throw(404, 'Car with such id does not exist');
    }

    await car.remove();

    ctx.status = 204;
    ctx.body = {};
  }

  static async updateCar(ctx: Context) {
    const { carId } = ctx.params;

    type requestBodyType = {
      numberPlate?: string,
      type?: CarType,
      modelType?: string,
      mileage?: number,
      soldAt?: Date,
    };

    const { numberPlate, type, modelType, mileage, soldAt }: requestBodyType = ctx.request.body;

    const car: ICar = await Car.findOne({ _id: ObjectId(carId) }).select('-__v');

    if (!car) {
      ctx.throw(404, 'Car with such id does not exist');
    }

    if (numberPlate) car.numberPlate = numberPlate;
    if (type) car.type = type;
    if (modelType) car.modelType = modelType;
    if (mileage) car.mileage = mileage;
    if (soldAt) car.soldAt = soldAt;

    await car.save();

    ctx.status = 204;
    ctx.body = {};
  }
}
