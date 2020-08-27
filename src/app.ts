import * as Koa from 'koa';
import * as Router from 'koa-joi-router';
import * as config from 'config';
import * as bodyParser from 'koa-body';
import * as httpLogger from 'koa-logger';
import * as cors from '@koa/cors';
import * as helmet from 'koa-helmet';
import { SwaggerAPI } from 'koa-joi-router-docs';
import { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import { createServer } from 'http';
import createConnection from './dbConnect';

type koa2SwaggerUiFunc = (config: Partial<KoaSwaggerUiOptions>) => Koa.Middleware;
const koaSwagger = require('koa2-swagger-ui') as koa2SwaggerUiFunc;

import carsRouter from './cars/cars.router';
import routesRouter from './route/route.router';
import errorCatcherMiddleware from './middlewares/errorCatcher';

const app = new Koa();
const router = Router();

const server = createServer(app.callback());

createConnection({ uri: config.get('database.url') });

const generator = new SwaggerAPI();

generator.addJoiRouter(carsRouter);
generator.addJoiRouter(routesRouter);

const spec = generator.generateSpec({
  info: {
    title: 'Test task API',
    description: 'API made with love.',
    version: '0.0.1',
  },
  basePath: '/',
  tags: [
    {
      name: 'cars',
      description: 'Group of API methods for managing cars',
    },
    {
      name: 'routes',
      description: 'Group of API methods for managing routes',
    },
  ],
}, {
  defaultResponses: {},
});

router.get('/api.json', async (ctx) => {
  ctx.body = JSON.stringify(spec, null, '  ');
});

app.use(httpLogger());

app.use(cors({
  credentials: true,
}));
app.use(bodyParser({
  multipart: true,
  includeUnparsed: true,
}));
app.use(errorCatcherMiddleware);
app.use(helmet());

app.use(
  koaSwagger({
    routePrefix: '/docs',
    hideTopbar: true,
    swaggerOptions: {
      url: `${config.get('server.baseUrl')}/api.json`,
    },
  }),
);

router.get('/', async (ctx) => {
  ctx.body = 'hello, world!';
});

router.use(carsRouter.middleware());
router.use(routesRouter.middleware());

app.use(router.middleware());

server.listen(config.get('server.port'), () => {
  console.log(`Server running on port ${config.get('server.port')}`);
});
