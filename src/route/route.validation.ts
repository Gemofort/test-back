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
        summary: 'Remove route',
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

  static setupAvailableCarsToRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Setup car to route',
        description: 'Setup car to route',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      params: {
        routeId: joi.string().required(),
      },
      body: {
        carId: joi.string().required(),
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

  static submitRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Submit route',
        description: 'Submit route and update route and car instances',
        tags: ['routes'],
      },
    },
    validate: {
      params: {
        routeId: joi.string().required(),
        carId: joi.string().required(),
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

  static searchRoutes: Router.Config = {
    meta: {
      swagger: {
        summary: 'Search routes by query parameters',
        description: 'Search routes by query parameters',
        tags: ['routes'],
      },
    },
    validate: {
      query: {
        departure: joi.string(),
        arrival: joi.string(),
        type: joi.string().valid(...Object.values(CarType)),
        status: joi.string().valid(...Object.values(DeliveryStatus)),
        carId: joi.string(),
        routeId: joi.string(),
      },
      output: {
        200: {
          body: { routes: joi.array().items({
            ...routeBaseJoiSchema,
            _id: joi.string().required(),
            status: joi.string().valid(...Object.values(DeliveryStatus)),
            startedAt: joi.date(),
            earnings: joi.number(),
            car: joi.object({
              ...carBaseJoiSchema,
              _id: joi.string().required(),
              __v: joi.number(),
            }).allow(null),
          }).required() },
        },
        404: {
          body: {
            error: joi.string(),
          },
        },
      },
    },
  };

  static getRouteById: Router.Config = {
    meta: {
      swagger: {
        summary: 'Search routes by query parameters',
        description: 'Search routes by query parameters',
        tags: ['routes'],
      },
    },
    validate: {
      params: {
        routeId: joi.string(),
      },
      output: {
        200: {
          body: {
            ...routeBaseJoiSchema,
            _id: joi.string().required(),
            status: joi.string().valid(...Object.values(DeliveryStatus)),
            startedAt: joi.date(),
            earnings: joi.number(),
            car: joi.object({
              ...carBaseJoiSchema,
              _id: joi.string().required(),
              __v: joi.number(),
            }).allow(null),
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

  static updateRoute: Router.Config = {
    meta: {
      swagger: {
        summary: 'Update route',
        description: 'Update route',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      params: {
        routeId: joi.string().required(),
      },
      body: {
        departure: joi.string(),
        arrival: joi.string(),
        distance: joi.number(),
        type: joi.string(),
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
