import { GraphQLSchema, printSchema } from 'graphql';

import QueryType from './queries';
import MutationType from './mutations';
import SubscriptionType from './subscriptions';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
});

console.log(printSchema(schema));
