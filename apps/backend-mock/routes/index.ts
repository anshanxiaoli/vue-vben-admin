export default defineEventHandler(() => {
  return `
<h1>Hello Vben Admin</h1>
<h2>Mock service is starting</h2>
<ul>
<li><a href="/api/user">/api/user/info</a></li>
<li><a href="/api/menu">/api/menu/all</a></li>
<li><a href="/api/auth/codes">/api/auth/codes</a></li>
<li><a href="/api/auth/login">/api/auth/login</a></li>
<li><a href="/api/form/read.success.get">/api/form/read.success.get</a></li>
<li><a href="/api/form/read.error.get">/api/form/read.error.get</a></li>
<li><a href="/api/form/submit.success.post">/api/form/submit.success.post</a></li>
<li><a href="/api/form/submit.error.post">/api/form/submit.error.post</a></li>
<li><a href="/api/list/read.success.get">/api/list/read.success.get</a></li>
<li><a href="/api/list/read.error.get">/api/list/read.error.get</a></li>
</ul>
`;
});
