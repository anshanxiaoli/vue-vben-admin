import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { forbiddenResponse } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);
  if (!password || !username) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'Username and password are required',
    );
  }

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    clearRefreshTokenCookie(event);
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  // 计算过期时间
  const now = new Date();
  const accessTokenExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7天
  const refreshTokenExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30天

  const accessTokenExpiresAt = new Date(now.getTime() + accessTokenExpiresIn);
  const refreshTokenExpiresAt = new Date(now.getTime() + refreshTokenExpiresIn);

  return useResponseSuccess({
    ...findUser,
    accessToken,
    expires: {
      accessToken: accessTokenExpiresAt.toISOString(),
      refreshToken: refreshTokenExpiresAt.toISOString(),
    },
  });
});
