import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  setResponseStatus(event, 500);
  return useResponseError('服务器内部错误', {
    errorCode: 'INTERNAL_SERVER_ERROR',
    errorMessage: '获取列表数据失败，请稍后重试',
    timestamp: new Date().toISOString(),
  });
});
