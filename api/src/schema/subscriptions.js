import { GraphQLNonNull, GraphQLObjectType, GraphQLID } from 'graphql';

import { pubsub } from '../pubsub';
import Task from './types/task';
import Approach from './types/approach';

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    taskMainListChanged: {
      type: new GraphQLNonNull(Task),
      resolve: async (source) => {
        return source.newTask;
      },
      subscribe: async () => {
        return pubsub.asyncIterator(['TASK_MAIN_LIST_CHANGED']);
      },
    },
    voteChanged: {
      type: new GraphQLNonNull(Approach),
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source) => {
        return source.updatedApproach;
      },
      subscribe: async (source, { taskId }) => {
        return pubsub.asyncIterator([`VOTE_CHANGED_${taskId}`]);
      },
    },
  }),
});

export default SubscriptionType;
