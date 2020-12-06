import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import UserPayload from './types/payload-user';
import UserInput from './types/input-user';
import AuthInput from './types/input-auth';
import TaskPayload from './types/payload-task';
import TaskInput from './types/input-task';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userCreate: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(UserInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.userCreate({ input });
      },
    },
    userLogin: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(AuthInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.userLogin({ input });
      },
    },
    taskCreate: {
      type: TaskPayload,
      args: {
        input: { type: new GraphQLNonNull(TaskInput) },
      },
      resolve: async (source, { input }, { mutators, currentUser }) => {
        return mutators.taskCreate({ input, currentUser });
      },
    },
  }),
});

export default MutationType;
