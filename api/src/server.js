import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import * as config from './config';

import pgApiWrapper from './db/pg-api';

import DataLoader from 'dataloader';

async function main() {
  const pgApi = await pgApiWrapper();
  const server = express();
  server.use(cors());
  server.use(morgan('dev'));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use('/:fav.ico', (req, res) => res.sendStatus(204));

  server.use('/', (req, res) => {
    const loaders = {
      users: new DataLoader((userIds) => pgApi.usersInfo(userIds)),
      approachLists: new DataLoader((taskIds) =>
        pgApi.approachLists(taskIds)
      ),
      tasks: new DataLoader((taskIds) => pgApi.tasksInfo(taskIds)),
      tasksByTypes: new DataLoader((types) =>
        pgApi.tasksByTypes(types)
      ),
    };
    graphqlHTTP({
      schema,
      context: { loaders },
      graphiql: true,
      customFormatErrorFn: (err) => {
        const errorReport = {
          message: err.message,
          locations: err.locations,
          stack: err.stack ? err.stack.split('\n') : [],
          path: err.path,
        };
        console.error('GraphQL Error', errorReport);
        return config.isDev
          ? errorReport
          : { message: 'Oops! Something went wrong! :(' };
      },
    })(req, res);
  });

  server.listen(config.port, () => {
    console.log(`Server URL: http://localhost:${config.port}/`);
  });
}

main();
