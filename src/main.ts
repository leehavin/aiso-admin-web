import { createApp } from "vue";
//app
import App from "./App.js";
//vue 路由
import { registerRouter } from "@/core/router/index.js";
//pinia
import { createPinia } from "pinia";
//ant-design-vue
import antd from "ant-design-vue";
//样式-引入覆盖antd
import "@/assets/styles/aiso-antd.less";
//antd icons
import { useAllIcons } from "@/core/utils/icons/index.js";
//vxe-table
import useVXETable from "@/core/utils/VxeTableUtil";
//打印
import print from "vue3-print-nb";
// 国际化
import i18n from "@/locale/Main.js";
// ant model 拖拽指令 v-ant-modal-drag
import { antModalDrag } from './plugins/AntModalDrag.js'

createApp(App).use(createPinia()).use(registerRouter()).use(antd).use(useAllIcons).use(useVXETable).use(print).use(i18n).use(antModalDrag).mount("#app");
