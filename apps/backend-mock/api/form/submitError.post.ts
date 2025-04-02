import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  setResponseStatus(event, 400);
  return useResponseError('ValidationError', {
    message: '表单验证失败',
    errors: [
      {
        field: 'username',
        message: '用户名已存在',
      },
    ],
    data: body,
    timestamp: new Date().toISOString(),
  });
});
