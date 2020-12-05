import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import UserPayload from './types/payload-user';
import UserInput from './types/input-user';

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
  }),
});

export default MutationType;
