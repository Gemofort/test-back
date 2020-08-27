import * as Router from 'koa-joi-router';
import { CarType, CarStatus } from './schemas/car.schema';

const joi = Router.Joi;

export const carBaseJoiSchema = {
  numberPlate: joi.string().required(),
  type: joi.string().valid(...Object.values(CarType)).required(),
  modelType: joi.string().required(),
  soldAt: joi.date().required(),
  mileage: joi.number().required(),
  status: joi.string().valid(...Object.values(CarStatus)),
};

export class CarsValidator {
  static createCar: Router.Config = {
    meta: {
      swagger: {
        summary: 'Create car',
        description: 'Create car instance',
        tags: ['cars'],
      },
    },
    validate: {
      type: 'json',
      body: { ...carBaseJoiSchema },
      output: {
        201: {
          body: {
            _id: joi.string().required(),
            ...carBaseJoiSchema,
          },
        },
        400: {
          body: {
            error: joi.string(),
          },
        },
      },
    },
  };

  static getCarById: Router.Config = {
    meta: {
      swagger: {
        summary: 'Get car',
        description: 'Get car instance by id',
        tags: ['cars'],
      },
    },
    validate: {
      type: 'json',
      params: {
        carId: joi.string().required(),
      },
      output: {
        200: {
          body: {
            _id: joi.string().required(),
            ...carBaseJoiSchema,
          },
        },
        404: {
          body: {
            error: joi.string(),
          },
        },
      },
    },
  };
}
