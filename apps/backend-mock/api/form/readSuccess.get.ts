import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  // 模拟表单数据
  const formData = {
    id: 1,
    name: '测试表单',
    description: '这是一个测试表单',
    status: 'active',
    createTime: '2024-04-02T12:00:00.000Z',
    updateTime: '2024-04-02T12:00:00.000Z',
    fields: [
      {
        id: 1,
        name: 'username',
        label: '用户名',
        type: 'text',
        required: true,
        placeholder: '请输入用户名',
      },
      {
        id: 2,
        name: 'password',
        label: '密码',
        type: 'password',
        required: true,
        placeholder: '请输入密码',
      },
      {
        id: 3,
        name: 'email',
        label: '邮箱',
        type: 'email',
        required: false,
        placeholder: '请输入邮箱',
      },
      {
        id: 4,
        name: 'role',
        label: '角色',
        type: 'select',
        required: true,
        options: [
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
          { label: '访客', value: 'guest' },
        ],
      },
    ],
  };

  return useResponseSuccess(formData);
});
