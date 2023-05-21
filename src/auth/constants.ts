export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  secretRefresh: process.env.JWT_REFRESH,
  accessExpiration: '30d',
  refreshExpiration: '30d',
};
