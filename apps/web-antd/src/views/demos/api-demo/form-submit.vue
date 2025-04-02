<script lang="ts" setup>
import { ref } from 'vue';

import { Alert, Button, Card, Form, Input, Select, Spin } from 'ant-design-vue';

import { requestClient } from '#/api/request';

// 定义表单数据类型
interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
}

// 状态管理
const successForm = ref<FormData>({
  username: '',
  password: '',
  email: '',
  role: '',
});
const successLoading = ref(false);
const successResult = ref<any>(null);
const successError = ref<Error | null>(null);

const errorForm = ref<FormData>({
  username: '',
  password: '',
  email: '',
  role: '',
});
const errorLoading = ref(false);
const errorResult = ref<any>(null);
const errorError = ref<Error | null>(null);

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '用户', value: 'user' },
  { label: '访客', value: 'guest' },
];

// 提交成功接口
async function handleSuccessSubmit() {
  try {
    successLoading.value = true;
    successError.value = null;
    const response = await requestClient.post(
      '/form/submitSuccess',
      successForm.value,
    );
    successResult.value = response;
  } catch (error) {
    successError.value = error as Error;
  } finally {
    successLoading.value = false;
  }
}

// 提交失败接口
async function handleErrorSubmit() {
  try {
    errorLoading.value = true;
    errorError.value = null;
    const response = await requestClient.post(
      '/form/submitError',
      errorForm.value,
    );
    errorResult.value = response;
  } catch (error) {
    errorError.value = error as Error;
  } finally {
    errorLoading.value = false;
  }
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">表单提交接口示例</h1>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 成功接口示例 -->
      <Card title="成功接口示例" class="mb-4">
        <Spin :spinning="successLoading">
          <Form layout="vertical" :model="successForm">
            <Form.Item label="用户名" required>
              <Input
                v-model:value="successForm.username"
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item label="密码" required>
              <Input.Password
                v-model:value="successForm.password"
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item label="邮箱">
              <Input
                v-model:value="successForm.email"
                placeholder="请输入邮箱"
              />
            </Form.Item>

            <Form.Item label="角色" required>
              <Select v-model:value="successForm.role" placeholder="请选择角色">
                <Select.Option
                  v-for="option in roleOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                @click="handleSuccessSubmit"
                :loading="successLoading"
              >
                提交表单（成功）
              </Button>
            </Form.Item>
          </Form>

          <div v-if="successResult" class="mt-4">
            <Alert type="success" message="表单提交成功" class="mb-4" />
            <pre class="overflow-auto rounded bg-gray-100 p-4">{{
              JSON.stringify(successResult, null, 2)
            }}</pre>
          </div>

          <Alert
            v-if="successError"
            type="error"
            :message="successError.message"
            class="mt-4"
          />
        </Spin>
      </Card>

      <!-- 失败接口示例 -->
      <Card title="失败接口示例" class="mb-4">
        <Spin :spinning="errorLoading">
          <Form layout="vertical" :model="errorForm">
            <Form.Item label="用户名" required>
              <Input
                v-model:value="errorForm.username"
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item label="密码" required>
              <Input.Password
                v-model:value="errorForm.password"
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item label="邮箱">
              <Input v-model:value="errorForm.email" placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item label="角色" required>
              <Select v-model:value="errorForm.role" placeholder="请选择角色">
                <Select.Option
                  v-for="option in roleOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                danger
                @click="handleErrorSubmit"
                :loading="errorLoading"
              >
                提交表单（失败）
              </Button>
            </Form.Item>
          </Form>

          <div v-if="errorResult" class="mt-4">
            <Alert
              type="info"
              message="接口返回了数据，但状态码不是 200"
              class="mb-4"
            />
            <pre class="overflow-auto rounded bg-gray-100 p-4">{{
              JSON.stringify(errorResult, null, 2)
            }}</pre>
          </div>

          <Alert
            v-if="errorError"
            type="error"
            :message="errorError.message"
            class="mt-4"
          />
        </Spin>
      </Card>
    </div>
  </div>
</template>
