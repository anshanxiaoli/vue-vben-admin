import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page ? String(query.page) : '1';
  const pageSize = query.pageSize ? String(query.pageSize) : '10';

  function getStatus(index: number) {
    if (index % 3 === 0) return 'active';
    if (index % 3 === 1) return 'pending';
    return 'inactive';
  }

  // 模拟列表数据
  const list = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `项目 ${index + 1}`,
    description: `这是项目 ${index + 1} 的描述`,
    status: getStatus(index),
    createTime: new Date(
      Date.now() - Math.floor(Math.random() * 10_000_000_000),
    ).toISOString(),
    updateTime: new Date(
      Date.now() - Math.floor(Math.random() * 1_000_000_000),
    ).toISOString(),
    tags: ['标签1', '标签2', '标签3'].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
  }));

  // 返回分页数据
  return usePageResponseSuccess(page, pageSize, list);
});
