import * as Router from 'koa-joi-router';
import { CarType } from '../cars/schemas/car.schema';
import { DeliveryStatus } from './schemas/route.schema';
import { carBaseJoiSchema } from '../cars/cars.validation';

const joi = Router.Joi;

export const routeBaseJoiSchema = {
  departure: joi.string().required(),
  arrival: joi.string().required(),
  distance: joi.number().required(),
  type: joi.string().valid(...Object.values(CarType)).required(),
};

export class RoutesValidator {
  static createRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Create route',
        description: 'Create route instance',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      body: { ...routeBaseJoiSchema },
      output: {
        201: {
          body: {
            _id: joi.string().required(),
            status: joi.string().valid(...Object.values(DeliveryStatus)).required(),
            ...routeBaseJoiSchema,
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

  static availableCarsToRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Get available cars to route',
        description: 'Get available cars to route',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      params: {
        routeId: joi.string().required(),
      },
      output: {
        200: {
          body: {
            cars: joi.array().items({
              _id: joi.any().required(),
              ...carBaseJoiSchema,
            }),
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

  static removeRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Romove route',
        description: 'Delete route from database',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      params: {
        routeId: joi.string().required(),
      },
      output: {
        204: {
          body: {},
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
