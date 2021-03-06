import * as Router from 'koa-joi-router';

import { RouteController } from './route.controller';
import { RoutesValidator } from './route.validation';

const routesRouter = Router();

routesRouter.post(
  '/routes',
  RoutesValidator.createRoute,
  RouteController.createRoute,
);

routesRouter.get(
  '/routes',
  RoutesValidator.searchRoutes,
  RouteController.searchRoutes,
);

routesRouter.get(
  '/routes/:routeId',
  RoutesValidator.getRouteById,
  RouteController.getRouteById,
);

routesRouter.get(
  '/routes/:routeId/cars',
  RoutesValidator.availableCarsToRoute,
  RouteController.availableCarsToRoute,
);

routesRouter.put(
  '/routes/:routeId',
  RoutesValidator.updateRoute,
  RouteController.updateRoute,
);

routesRouter.put(
  '/routes/:routeId/cars',
  RoutesValidator.setupAvailableCarsToRoute,
  RouteController.setupAvailableCarsToRoute,
);

routesRouter.put(
  '/routes/:routeId/cars/:carId',
  RoutesValidator.submitRoute,
  RouteController.submitRoute,
);

routesRouter.delete(
  '/routes/:routeId',
  RoutesValidator.removeRoute,
  RouteController.removeRoute,
);

export default routesRouter;
