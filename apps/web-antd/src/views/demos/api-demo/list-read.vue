<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';

import {
  Alert,
  Button,
  Card,
  Input,
  Space,
  Spin,
  Table,
  Tag,
} from 'ant-design-vue';

import { requestClient } from '#/api/request';

// 定义列表项数据类型
interface ListItem {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createTime: string;
  updateTime: string;
  description: string;
}

interface ListResponse {
  items: ListItem[];
  total: number;
  page: number;
  pageSize: number;
}

// 状态管理
const successData = ref<ListResponse | null>(null);
const successLoading = ref(false);
const successError = ref<Error | null>(null);
const successPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const errorData = ref<ListResponse | null>(null);
const errorLoading = ref(false);
const errorError = ref<Error | null>(null);
const errorPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 搜索关键词
const successSearchKeyword = ref('');
const errorSearchKeyword = ref('');

// 请求成功接口
async function fetchSuccess(page = 1, pageSize = 10, keyword = '') {
  try {
    successLoading.value = true;
    successError.value = null;
    const data = await requestClient.get<ListResponse>('/list/readSuccess', {
      params: {
        page,
        pageSize,
        keyword,
      },
    });
    successData.value = data;
    successPagination.value = {
      current: page,
      pageSize,
      total: data.total,
    };
  } catch (error) {
    successError.value = error as Error;
  } finally {
    successLoading.value = false;
  }
}

// 请求失败接口
async function fetchError(page = 1, pageSize = 10, keyword = '') {
  try {
    errorLoading.value = true;
    errorError.value = null;
    const data = await requestClient.get<ListResponse>('/list/readError', {
      params: {
        page,
        pageSize,
        keyword,
      },
    });
    errorData.value = data;
    errorPagination.value = {
      current: page,
      pageSize,
      total: data.total,
    };
  } catch (error) {
    errorError.value = error as Error;
  } finally {
    errorLoading.value = false;
  }
}

// 处理成功列表分页变化
function handleSuccessTableChange(pagination: any) {
  fetchSuccess(
    pagination.current,
    pagination.pageSize,
    successSearchKeyword.value,
  );
}

// 处理失败列表分页变化
function handleErrorTableChange(pagination: any) {
  fetchError(pagination.current, pagination.pageSize, errorSearchKeyword.value);
}

// 处理成功列表搜索
function handleSuccessSearch() {
  fetchSuccess(1, successPagination.value.pageSize, successSearchKeyword.value);
}

// 处理失败列表搜索
function handleErrorSearch() {
  fetchError(1, errorPagination.value.pageSize, errorSearchKeyword.value);
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
    active: { text: '活跃', color: 'success' },
    inactive: { text: '未激活', color: 'default' },
    pending: { text: '待处理', color: 'processing' },
  } as const;
  return statusMap[status];
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    customRender: ({ text }: { text: 'active' | 'inactive' | 'pending' }) => {
      const { text: statusText, color } = formatStatus(text);
      return h(Tag, { color }, () => statusText);
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
];
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">列表读取接口示例</h1>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 成功接口示例 -->
      <Card title="成功接口示例" class="mb-4">
        <div class="mb-4 flex items-center justify-between">
          <Space>
            <Button
              type="primary"
              @click="
                fetchSuccess(
                  1,
                  successPagination.pageSize,
                  successSearchKeyword,
                )
              "
              :loading="successLoading"
            >
              刷新数据
            </Button>
          </Space>
          <Input.Search
            v-model:value="successSearchKeyword"
            placeholder="搜索关键词"
            style="width: 200px"
            @search="handleSuccessSearch"
          />
        </div>

        <Spin :spinning="successLoading">
          <Alert
            v-if="successError"
            type="error"
            :message="successError.message"
            class="mb-4"
          />

          <Table
            v-if="successData"
            :columns="columns"
            :data-source="successData.items"
            :pagination="successPagination"
            row-key="id"
            @change="handleSuccessTableChange"
          />
        </Spin>
      </Card>

      <!-- 失败接口示例 -->
      <Card title="失败接口示例" class="mb-4">
        <div class="mb-4 flex items-center justify-between">
          <Space>
            <Button
              type="primary"
              danger
              @click="
                fetchError(1, errorPagination.pageSize, errorSearchKeyword)
              "
              :loading="errorLoading"
            >
              刷新数据
            </Button>
          </Space>
          <Input.Search
            v-model:value="errorSearchKeyword"
            placeholder="搜索关键词"
            style="width: 200px"
            @search="handleErrorSearch"
          />
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
            <Table
              :columns="columns"
              :data-source="errorData.items"
              :pagination="errorPagination"
              row-key="id"
              @change="handleErrorTableChange"
            />
          </div>
        </Spin>
      </Card>
    </div>
  </div>
</template>
