<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { FormInstance } from "ant-design-vue";
import { useAuthority } from "@/utils/Authority";
import AppIcon from "@/core/components/AppIcon.vue";
import Info from "./Info.vue";
import Tools from "@/core/utils/Tools";
import PageContainer from "@/core/components/PageContainer.vue";
import TableCurd from "@/core/components/curd/TableCurd.vue";
import SysFileService from "@/services/system/SysFileService";
import UploadFileModal from "./UploadFileModal.vue";
import AppConsts from "@/utils/AppConsts";

defineOptions({ name: "system_file" });

const columns: any[] = [
  {
    fieldName: "fullUrl",
    title: "预览",
    show: true,
    width: 150,
    dataIndex: "fullUrl",
    align: "center",
  },
  {
    fieldName: "originalName",
    title: "文件名称",
    show: true,
    width: 300,
    dataIndex: "originalName",
    ellipsis: true,
    resizable: true,
  },
  {
    fieldName: "fileSize",
    title: "文件大小",
    show: true,
    width: 100,
    dataIndex: "fileSize",
  },
  {
    fieldName: "fileType",
    title: "文件类型",
    show: true,
    width: 100,
    dataIndex: "fileType",
  },
  {
    fieldName: "mimeType",
    title: "媒体类型",
    show: true,
    width: 150,
    dataIndex: "mimeType",
    ellipsis: true,
    resizable: true,
  },
  {
    fieldName: "sha",
    title: "SHA256摘要",
    show: true,
    width: 150,
    dataIndex: "sha",
    ellipsis: true,
    resizable: true,
  },
  {
    fieldName: "creationTime",
    title: "创建时间",
    show: true,
    width: 200,
    dataIndex: "creationTime",
  },
  {
    fieldName: "lastModificationTime",
    title: "最后更新时间",
    show: true,
    width: 200,
    dataIndex: "lastModificationTime",
  },
  {
    fieldName: "id",
    title: "操作",
    show: true,
    width: 200,
    sorter: false,
    dataIndex: "id",
  },
];

const props = defineProps<{
  isModal?: boolean;
  isMultiple?: boolean;
  defaultSearch?: any;
}>();

const emits = defineEmits<{
  (e: "success", data: any): void;
}>();

const state = reactive({
  search: {
    state: false,
    vm: {
      fileName: undefined,
    },
    sort: [] as any[],
  },
  loading: false,
  page: 1,
  size: 10,
  total: 100,
  columns: columns,
  data: [] as any,
  fileList: [] as any[],
  scroll: { x: 1350 },
});

const modalOpen = ref(false);

//权限
const power = useAuthority();
//表格
const refTableCurd = ref<InstanceType<typeof TableCurd>>();
//表单操作对象
const refInfo = ref<InstanceType<typeof Info>>();
//检索表单
const refSearchForm = ref<FormInstance>();
const uploadFileModalRef = ref<InstanceType<typeof UploadFileModal>>();

/**
 * 初始化
 */
onMounted(() => {
  if (!props.isModal) {
    findList();
  }
});

/**
 *获取数据
 */
async function findList() {
  try {
    state.loading = true;

    const result = await SysFileService.findList(state.page, state.size, state.search.vm, state.search.sort);
    state.loading = false;
    if (result.code != 200) return;
    state.page = result.data.page;
    state.size = result.data.size;
    state.total = result.data.total;
    // state.columns = result.data.columns;
    state.data = result.data.dataSource;
  } catch (error) {
    state.loading = false;
  }
}

/**
 * 删除数据
 * @param id
 */
async function deleteList(id?: string) {
  let ids: string[] = [];
  if (id) {
    ids.push(id);
  } else {
    ids = refTableCurd.value?.getSelectedRowKeys() ?? [];
  }

  if (ids.length == 0) return Tools.message.error("请选择要删除的行!");

  try {
    state.loading = true;
    const result = await SysFileService.deleteList(ids);
    state.loading = false;
    if (result.code != 200) return;
    Tools.message.success("删除成功!");
    findList();
  } catch (error) {
    state.loading = false;
  }
}

/**
 * 导出excel
 */
function exportExcel() {
  SysFileService.exportExcel(state.search.vm, state.search.sort);
}

async function downloadFile(record: any) {
  try {
    record.percent = 0;
    record.abort = new AbortController();
    await SysFileService.downloadFile(record.id, record.abort, (value) => {
      record.percent = value;
      if (value && value >= 100) {
        record.percent = undefined;
        record.abort = undefined;
      }
    });
  } catch (error) {
    record.percent = undefined;
    record.abort = undefined;
  }
}

function cnanelDownload(record: any) {
  record.abort?.abort();
}

function moadalSubmit() {
  const selectKeys = refTableCurd.value?.getSelectedRowKeys() ?? [];
  if (selectKeys.length == 0) return;

  const row = state.data.find((item: any) => item.id == selectKeys[0]);
  emits("success", row);

  modalOpen.value = false;
}

function formatFileSize(fileSizeInBytes: number) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (fileSizeInBytes >= GB) {
    return (fileSizeInBytes / GB).toFixed(2) + " GB";
  } else if (fileSizeInBytes >= MB) {
    return (fileSizeInBytes / MB).toFixed(2) + " MB";
  } else if (fileSizeInBytes >= KB) {
    return (fileSizeInBytes / KB).toFixed(2) + " KB";
  } else {
    return fileSizeInBytes + " Bytes";
  }
}

defineExpose({
  open: () => {
    modalOpen.value = true;
    if (props.defaultSearch) {
      state.search.vm = props.defaultSearch;
    }
    findList();
  },
});
</script>

<template>
  <div>
    <PageContainer v-if="!props.isModal">
      <TableCurd ref="refTableCurd" v-model:config="state" @change="
        (changeTable) => {
          state.page = changeTable.pagination.current ?? 1;
          state.size = changeTable.pagination.pageSize ?? state.size;
          state.search.sort = changeTable.sorter instanceof Array ? [...changeTable.sorter] : [changeTable.sorter];
          findList();
        }
      " @show-size-change="
          ({ current, size }) => {
            state.page = current == 0 ? 1 : current;
            state.size = size;
            findList();
          }
        ">
        <!-- search -->
        <template #search>
          <a-form ref="refSearchForm" :model="state.search.vm" v-if="power.search">
            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-form-item class="mb-0" name="fileName" label="文件名称">
                  <a-input v-model:value="state.search.vm.fileName" placeholder="文件名称" />
                </a-form-item>
              </a-col>
              <!--button-->
              <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="text-right">
                <a-space :size="8">
                  <a-button @click="
                    state.page = 1;
                  refSearchForm?.resetFields();
                  findList();
                  ">
                    重置
                  </a-button>
                  <a-button type="primary" @click="
                    state.page = 1;
                  findList();
                  ">
                    查询
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <!-- toolbar-left -->
        <template #toolbar-left>
          <a-button @click="state.search.state = !state.search.state" v-if="power.search">
            <div v-if="state.search.state">
              <AppIcon name="UpOutlined" />&nbsp;&nbsp;收起
            </div>
            <div v-else>
              <AppIcon name="DownOutlined" />&nbsp;&nbsp;展开
            </div>
          </a-button>
          <a-button type="primary" @click="() => refInfo?.open()" v-if="power.insert">
            <template #icon>
              <AppIcon name="PlusOutlined" />
            </template>
            新建
          </a-button>
          <a-popconfirm title="您确定要删除?" @confirm="deleteList()" okText="确定" cancelText="取消" v-if="power.delete">
            <a-button type="primary" danger>
              <template #icon>
                <AppIcon name="DeleteOutlined" />
              </template>
              批量删除
            </a-button>
          </a-popconfirm>
          <a-button @click="uploadFileModalRef?.open()" v-if="power.insert">
            <template #icon>
              <AppIcon name="UploadOutlined" />
            </template>
            上传附件
          </a-button>
        </template>
        <!-- toolbar-right -->
        <template #toolbar-right>
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="exportExcel()">导出 Excel</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              更多
              <AppIcon name="ellipsis-outlined" />
            </a-button>
          </a-dropdown>
        </template>

        <template #fullUrl="item">
          <a-table-column v-bind="item">
            <template #default="{ record }">
              <template v-if="AppConsts.imgTypes.includes(record.fileType)">
                <a-image :src="record.fullUrl" style="max-height: 60px; max-width: 120px" />
              </template>
              <template v-else>
                <span>暂无预览</span>
              </template>
            </template>
          </a-table-column>
        </template>

        <template #fileSize="item">
          <a-table-column v-bind="item">
            <template #default="{ record }">
              <span>{{ formatFileSize(record.fileSize) }}</span>
            </template>
          </a-table-column>
        </template>

        <!--列插槽-->
        <template #id="item">
          <!-- 操作 -->
          <a-table-column v-bind="item" v-if="power.update || power.delete" fixed="right">
            <template #default="{ record }">
              <div v-if="record.percent != undefined" class="porgress-box">
                <a-progress :percent="record.percent" />
                <a-button type="primary" shape="circle" danger class="porgress-button" @click="cnanelDownload(record)">
                  <CloseOutlined style="font-size: 10px" />
                </a-button>
              </div>
              <a-button type="link" @click="() => downloadFile(record)"
                :disabled="record.percent != undefined">下载</a-button>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="() => refInfo?.open(record.id)" v-if="power.update">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="您确定要删除?" @confirm="deleteList(record.id)" okText="确定" cancelText="取消"
                v-if="power.delete">
                <a class="text-danger">删除</a>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </TableCurd>
    </PageContainer>

    <a-modal v-if="props.isModal" v-model:open="modalOpen" title="选择附件" centered @ok="modalOpen = false" width="80%">
      <template #footer v-if="props.isModal">
        <a-button type="primary" :loading="state.loading" @click="moadalSubmit()"> 提交</a-button>
        <a-button @click="modalOpen = false">关闭</a-button>
      </template>

      <TableCurd ref="refTableCurd" v-model:config="state" @change="
        (changeTable) => {
          state.page = changeTable.pagination.current ?? 1;
          state.size = changeTable.pagination.pageSize ?? state.size;
          state.search.sort = changeTable.sorter instanceof Array ? [...changeTable.sorter] : [changeTable.sorter];
          findList();
        }
      " @show-size-change="
          ({ current, size }) => {
            state.page = current == 0 ? 1 : current;
            state.size = size;
            findList();
          }
        ">
        <!-- search -->
        <template #search>
          <a-form ref="refSearchForm" :model="state.search.vm" v-if="power.search">
            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                <a-form-item class="mb-0" name="fileName" label="文件名称">
                  <a-input v-model:value="state.search.vm.fileName" placeholder="文件名称" />
                </a-form-item>
              </a-col>
              <!--button-->
              <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="text-right">
                <a-space :size="8">
                  <a-button @click="
                    state.page = 1;
                  refSearchForm?.resetFields();
                  findList();
                  ">
                    重置
                  </a-button>
                  <a-button type="primary" @click="
                    state.page = 1;
                  findList();
                  ">
                    查询
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <!-- toolbar-left -->
        <template #toolbar-left>
          <a-button @click="state.search.state = !state.search.state" v-if="power.search">
            <div v-if="state.search.state">
              <AppIcon name="UpOutlined" />&nbsp;&nbsp;收起
            </div>
            <div v-else>
              <AppIcon name="DownOutlined" />&nbsp;&nbsp;展开
            </div>
          </a-button>
          <a-button type="primary" @click="() => refInfo?.open()" v-if="power.insert">
            <template #icon>
              <AppIcon name="PlusOutlined" />
            </template>
            新建
          </a-button>
          <a-popconfirm title="您确定要删除?" @confirm="deleteList()" okText="确定" cancelText="取消" v-if="power.delete">
            <a-button type="primary" danger>
              <template #icon>
                <AppIcon name="DeleteOutlined" />
              </template>
              批量删除
            </a-button>
          </a-popconfirm>
          <a-button @click="uploadFileModalRef?.open()" v-if="power.insert">
            <template #icon>
              <AppIcon name="UploadOutlined" />
            </template>
            上传附件
          </a-button>
        </template>
        <!-- toolbar-right -->
        <template #toolbar-right>
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="exportExcel()">导出 Excel</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              更多
              <AppIcon name="ellipsis-outlined" />
            </a-button>
          </a-dropdown>
        </template>

        <template #fullUrl="item">
          <a-table-column v-bind="item">
            <template #default="{ record }">
              <template v-if="AppConsts.imgTypes.includes(record.fileType)">
                <a-image :src="record.fullUrl" style="max-height: 60px; max-width: 120px" />
              </template>
              <template v-else>
                <span>暂无预览</span>
              </template>
            </template>
          </a-table-column>
        </template>

        <!--列插槽-->
        <template #id="item">
          <!-- 操作 -->
          <a-table-column v-bind="item" v-if="power.update || power.delete" fixed="right">
            <template #default="{ record }">
              <div v-if="record.percent != undefined" class="porgress-box">
                <a-progress :percent="record.percent" />
                <a-button type="primary" shape="circle" danger class="porgress-button" @click="cnanelDownload(record)">
                  <CloseOutlined style="font-size: 10px" />
                </a-button>
              </div>
              <a-button type="link" @click="() => downloadFile(record)"
                :disabled="record.percent != undefined">下载</a-button>
              <a-divider type="vertical" />
              <a href="javascript:;" @click="() => refInfo?.open(record.id)" v-if="power.update">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="您确定要删除?" @confirm="deleteList(record.id)" okText="确定" cancelText="取消"
                v-if="power.delete">
                <a class="text-danger">删除</a>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </TableCurd>
    </a-modal>
    <!-- Info -->
    <Info ref="refInfo" @on-success="findList()" />
    <UploadFileModal ref="uploadFileModalRef" @on-close="findList()" />
  </div>
</template>

<style lang="css" scoped>
.porgress-box {
  display: flex;
  align-items: center;
}

.porgress-button {
  margin-left: 8px;
  border-radius: 50%;
  min-width: auto;
  width: 20px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
