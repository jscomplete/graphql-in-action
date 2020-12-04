import pgClient from './pg-client';
import sqls from './sqls';

const pgApiWrapper = async () => {
  const { pgPool } = await pgClient();
  const pgQuery = (text, params = {}) =>
    pgPool.query(text, Object.values(params));

  return {
    taskMainList: async () => {
      const pgResp = await pgQuery(sqls.tasksLatest);
      return pgResp.rows;
    },
    userInfo: async (userId) => {
      const pgResp = await pgQuery(sqls.usersFromIds, { $1: [userId] });
      return pgResp.rows[0];
    },
  };
};

export default pgApiWrapper;
