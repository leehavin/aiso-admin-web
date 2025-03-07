<template>
  <div class="container">
    <a-row :gutter="8">
      <a-col :md="12" :sm="24">
        <a-card hoverable title="系统信息">
          <table class="sysInfo_table">
            <tbody>
              <tr>
                <td class="sysInfo_td">主机名称：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.hostName }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">操作系统：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.systemOs }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">系统架构：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.osArchitecture }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">CPU核数：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.processorCount }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">运行时长：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.sysRunTime }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">外网地址：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.remoteIp }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">内网地址：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.localIp }}</td>
              </tr>
              <tr>
                <td class="sysInfo_td">运行框架：</td>
                <td class="sysInfo_td">{{ state.machineBaseInfo.frameworkDescription }}</td>
              </tr>
            </tbody>
          </table>
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-card hoverable title="使用信息">
          <a-row>
            <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="text-align: center">
              <a-progress
                type="dashboard"
                :percent="
                  parseInt(
                    state.machineUseInfo.ramRate == undefined ? 0 : state.machineUseInfo.ramRate.substr(0, state.machineUseInfo.ramRate.length - 1)
                  )
                ">
                <template #format>
                  <span>{{ state.machineUseInfo.ramRate }}<br /></span>
                  <span style="font-size: 10px">
                    已用:{{ state.machineUseInfo.usedRam }}<br />
                    剩余:{{ state.machineUseInfo.freeRam }}<br />
                    内存使用率
                  </span>
                </template>
              </a-progress>
            </a-col>
            <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="text-align: center">
              <a-progress
                type="dashboard"
                :percent="
                  parseInt(
                    state.machineUseInfo.cpuRate == undefined ? 0 : state.machineUseInfo.cpuRate.substr(0, state.machineUseInfo.cpuRate.length - 1)
                  )
                ">
                <template #format>
                  <span>{{ state.machineUseInfo.cpuRate }}<br /></span>
                  <span style="font-size: 10px"> CPU使用率 </span>
                </template>
              </a-progress>
            </a-col>
          </a-row>

          <a-row>
            <table class="sysInfo_table">
              <tbody>
                <tr v-for="netWorkInfo in state.machineUseInfo.netWorkMetrics">
                  <td class="sysInfo_td">{{ netWorkInfo.adapter }}:</td>
                  <td class="sysInfo_td">上行：{{ netWorkInfo.uploadSpeed }} 下行：{{ netWorkInfo.downloadSpeed }}</td>
                </tr>
                <tr>
                  <td class="sysInfo_td">启动时间：</td>
                  <td class="sysInfo_td">{{ state.machineUseInfo.startTime }}</td>
                </tr>
                <tr>
                  <td class="sysInfo_td">运行时长：</td>
                  <td class="sysInfo_td">{{ state.machineUseInfo.runTime }}</td>
                </tr>
                <tr>
                  <td class="sysInfo_td">网站目录：</td>
                  <td class="sysInfo_td">{{ state.machineBaseInfo.wwwroot }}</td>
                </tr>
                <tr>
                  <td class="sysInfo_td">开发环境：</td>
                  <td class="sysInfo_td">{{ state.machineBaseInfo.environment }}</td>
                </tr>
                <tr>
                  <td class="sysInfo_td">环境变量：</td>
                  <td class="sysInfo_td">{{ state.machineBaseInfo.stage }}</td>
                </tr>
              </tbody>
            </table>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :md="24" :sm="24">
        <a-card hoverable title="程序集信息" style="margin-top: 5px; --a-card-padding: 10px">
          <div v-for="d in state.assemblyInfo" :key="d.name" style="display: inline-block; margin: 4px; text-align: left">
            <a-tag color="green">
              <div style="display: inline-flex">
                <div>{{ d.name }}</div>
                <div style="color: black; font-size: 9px; margin-left: 3px">v{{ d.version }}</div>
              </div>
            </a-tag>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :md="24" :sm="24">
        <a-card hoverable title="磁盘信息" style="margin-top: 5px">
          <a-row>
            <a-col
              :span="4"
              :xs="(24 / state.machineDiskInfo.length) * 2"
              :sm="24 / state.machineDiskInfo.length"
              :md="24 / state.machineDiskInfo.length"
              :lg="24 / state.machineDiskInfo.length"
              :xl="24 / state.machineDiskInfo.length"
              v-for="d in state.machineDiskInfo"
              :key="d.diskName"
              style="text-align: center">
              <a-progress type="circle" :percent="d.availablePercent">
                <template #format>
                  <span>{{ d.availablePercent }}%<br /></span>
                  <span style="font-size: 10px">
                    已用:{{ d.used }}GB<br />
                    剩余:{{ d.availableFreeSpace }}GB<br />
                    {{ d.diskName }}
                  </span>
                </template>
              </a-progress>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup name="sysServer">
import { onActivated, onDeactivated, onMounted, onUnmounted, reactive } from "vue";
defineOptions({ name: "server" });

import SysServerService from "@/services/system/SysServerService";

const state = reactive({
  machineBaseInfo: [] as any,
  machineUseInfo: [] as any,
  machineDiskInfo: [] as any,
  assemblyInfo: [] as any,
  timer: null as any,
});

onMounted(async () => {
  loadMachineBaseInfo();
  loadMachineUseInfo();
  loadMachineDiskInfo();
  loadAssemblyInfo();

  if (state.timer) return;
  state.timer = setInterval(() => {
    refreshData();
  }, 1000);
});

// 服务器配置信息
const loadMachineBaseInfo = async () => {
  var res = await SysServerService.getServerBase();
  if (res.code != 200) {
    return;
  }
  state.machineBaseInfo = res.data;
};

// 服务器内存信息
const loadMachineUseInfo = async () => {
  var res = await SysServerService.getServerUsed();
  if (res.code != 200) {
    return;
  }
  state.machineUseInfo = res.data;
};

// 服务器磁盘信息
const loadMachineDiskInfo = async () => {
  var res = await SysServerService.getServerDisk();
  if (res.code != 200) {
    return;
  }
  state.machineDiskInfo = res.data;
};

// 框架程序集信息
const loadAssemblyInfo = async () => {
  var res = await SysServerService.getAssemblyList();
  if (res.code != 200) {
    return;
  }
  state.assemblyInfo = res.data;
};

// 实时刷新内存
const refreshData = () => {
  loadMachineUseInfo();
};

onActivated(() => {
  loadMachineBaseInfo();
  loadMachineDiskInfo();
  loadMachineUseInfo();
  if (state.timer) return;
  state.timer = setInterval(() => {
    refreshData();
  }, 1000);
});

onDeactivated(() => {
  if(state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
});

onUnmounted(() => {
  if(state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
})
</script>

<style lang="css" scoped>
.container {
  margin: 16px;
}
.sysInfo_table {
  width: 100%;
  min-height: 40px;
  line-height: 40px;
  text-align: center;
}

.sysInfo_td {
  border-bottom: 1px solid #e8e8e8;
  min-width: 100px;
}
</style>
