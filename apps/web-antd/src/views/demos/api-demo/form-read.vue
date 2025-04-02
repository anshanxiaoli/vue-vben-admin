<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Alert, Button, Card, Descriptions, Spin } from 'ant-design-vue';

import { requestClient } from '#/api/request';

// 定义表单数据类型
interface FormField {
  id: number;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

interface FormData {
  id: number;
  name: string;
  description: string;
  status: string;
  createTime: string;
  updateTime: string;
  fields: FormField[];
}

// 状态管理
const successData = ref<FormData | null>(null);
const successLoading = ref(false);
const successError = ref<Error | null>(null);

const errorData = ref<FormData | null>(null);
const errorLoading = ref(false);
const errorError = ref<Error | null>(null);

// 请求成功接口
async function fetchSuccess() {
  try {
    successLoading.value = true;
    successError.value = null;
    const data = await requestClient.get<FormData>('/form/readSuccess');
    successData.value = data;
  } catch (error) {
    successError.value = error as Error;
  } finally {
    successLoading.value = false;
  }
}

// 请求失败接口
async function fetchError() {
  try {
    errorLoading.value = true;
    errorError.value = null;
    const data = await requestClient.get<FormData>('/form/readError');
    errorData.value = data;
  } catch (error) {
    errorError.value = error as Error;
  } finally {
    errorLoading.value = false;
  }
}

// 页面加载时请求成功接口
onMounted(() => {
  fetchSuccess();
});

// 格式化日期
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

// 格式化状态
function formatStatus(status: 'active' | 'inactive' | 'pending') {
  const statusMap = {
    active: '活跃',
    inactive: '未激活',
    pending: '待处理',
  } as const;
  return statusMap[status];
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">表单读取接口示例</h1>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 成功接口示例 -->
      <Card title="成功接口示例" class="mb-4">
        <div class="mb-4">
          <Button
            type="primary"
            @click="fetchSuccess"
            :loading="successLoading"
          >
            重新请求
          </Button>
        </div>

        <Spin :spinning="successLoading">
          <Alert
            v-if="successError"
            type="error"
            :message="successError.message"
            class="mb-4"
          />

          <div v-if="successData">
            <Descriptions title="表单基本信息" bordered>
              <Descriptions.Item label="ID">
                {{ successData.id }}
              </Descriptions.Item>
              <Descriptions.Item label="名称">
                {{ successData.name }}
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {{ successData.description }}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {{
                  formatStatus(
                    successData.status as 'active' | 'inactive' | 'pending',
                  )
                }}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {{ formatDate(successData.createTime) }}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {{ formatDate(successData.updateTime) }}
              </Descriptions.Item>
            </Descriptions>

            <h3 class="mb-2 mt-4 text-lg font-semibold">表单字段</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 p-2">ID</th>
                    <th class="border border-gray-300 p-2">名称</th>
                    <th class="border border-gray-300 p-2">标签</th>
                    <th class="border border-gray-300 p-2">类型</th>
                    <th class="border border-gray-300 p-2">必填</th>
                    <th class="border border-gray-300 p-2">占位符</th>
                    <th class="border border-gray-300 p-2">选项</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="field in successData.fields"
                    :key="field.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="border border-gray-300 p-2">{{ field.id }}</td>
                    <td class="border border-gray-300 p-2">{{ field.name }}</td>
                    <td class="border border-gray-300 p-2">
                      {{ field.label }}
                    </td>
                    <td class="border border-gray-300 p-2">{{ field.type }}</td>
                    <td class="border border-gray-300 p-2">
                      {{ field.required ? '是' : '否' }}
                    </td>
                    <td class="border border-gray-300 p-2">
                      {{ field.placeholder || '-' }}
                    </td>
                    <td class="border border-gray-300 p-2">
                      <div v-if="field.options">
                        <div
                          v-for="option in field.options"
                          :key="option.value"
                        >
                          {{ option.label }} ({{ option.value }})
                        </div>
                      </div>
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Spin>
      </Card>

      <!-- 失败接口示例 -->
      <Card title="失败接口示例" class="mb-4">
        <div class="mb-4">
          <Button
            type="primary"
            danger
            @click="fetchError"
            :loading="errorLoading"
          >
            重新请求
          </Button>
        </div>

        <Spin :spinning="errorLoading">
          <Alert
            v-if="errorError"
            type="error"
            :message="errorError.message"
            class="mb-4"
          />

          <div v-if="errorData">
            <Alert
              type="info"
              message="接口返回了数据，但状态码不是 200"
              class="mb-4"
            />
            <pre class="overflow-auto rounded bg-gray-100 p-4">{{
              JSON.stringify(errorData, null, 2)
            }}</pre>
          </div>
        </Spin>
      </Card>
    </div>
  </div>
</template>
