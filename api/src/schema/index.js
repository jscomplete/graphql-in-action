import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Query {
    currentTime: String!
  }
`);

export const rootValue = {
  currentTime: () => {
    const isoString = new Date().toISOString();
    return isoString.slice(11, 19);
  },
};
