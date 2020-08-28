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

  static searchCars: Router.Config = {
    meta: {
      swagger: {
        summary: 'Search routes by query parameters',
        description: 'Search routes by query parameters',
        tags: ['routes'],
      },
    },
    validate: {
      type: 'json',
      query: {
        numberPlate: joi.string(),
        modelType: joi.string(),
        type: joi.string().valid(...Object.values(CarType)),
        soldAt: joi.date(),
        carId: joi.string(),
        mileage: joi.number(),
      },
      output: {
        200: {
          body: joi.any(),
        },
        404: {
          body: {
            error: joi.string(),
          },
        },
      },
    },
  };

  static deleteCar: Router.Config = {
    meta: {
      swagger: {
        summary: 'Remove car',
        description: 'Delete car instance by id',
        tags: ['cars'],
      },
    },
    validate: {
      type: 'json',
      params: {
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

  static updateCar: Router.Config = {
    meta: {
      swagger: {
        summary: 'Modify car',
        description: 'Modify car instance by id',
        tags: ['cars'],
      },
    },
    validate: {
      type: 'json',
      params: {
        carId: joi.string().required(),
      },
      body: {
        numberPlate: joi.string(),
        type: joi.string().valid(...Object.values(CarType)),
        modelType: joi.string(),
        soldAt: joi.date(),
        mileage: joi.number(),
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
