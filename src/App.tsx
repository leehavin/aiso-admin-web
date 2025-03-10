import { defineComponent, computed } from "vue";
import { ConfigProvider, Spin } from "ant-design-vue";
import AppStore from "@/core/store/AppStore";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import ThemeStore from "@/core/store/layouts/ThemeStore";
import HeaderStore from "@/core/store/layouts/HeaderStore";
import CoreStore from "@/core/store/layouts/CoreStore";
import LocaleUtils from "@/utils/LocaleUtils";

export default defineComponent({
    setup(props, ctx) {
        const appStore = AppStore();
        const { getLocale } = LocaleUtils();
        const loading = computed(() => appStore.state.loading);

        const themeStore = ThemeStore();
        const headerStore = HeaderStore();
        const coreStore = CoreStore();

        let colorItemBgSelectedObject = computed(() => {
            return JSON.stringify(themeStore.state.menuTheme) == "{}" ? {} : {
                colorItemBgSelected: themeStore.state.tokenTheme!.colorPrimary
            }
        })

        let layoutColorBgHeader = computed(() => {
            document.documentElement.style.setProperty("--primary-color", themeStore.state.tokenTheme!.colorPrimary ?? "#2f54eb");
            return headerStore.state.useColorPrimary ? { colorBgHeader: themeStore.state.tokenTheme?.colorPrimary } : { colorBgHeader: 'transparent' }
        })

        // 计算国际化
        const locale = computed(() => {
            if (coreStore.state.locale == 'zh-CN') {
                dayjs.locale("zh-cn");
                return zhCN;
            }
            dayjs.locale("en-us");
            return enUS;
        });
        
        getLocale();

        return () => (
            <ConfigProvider
                locale={locale.value}
                theme={{
                    token: themeStore.state.tokenTheme,
                    components: {
                        Menu: {
                            ...themeStore.state.menuTheme,
                            ...colorItemBgSelectedObject.value
                        },
                        Layout: {
                            ...layoutColorBgHeader.value
                        }
                    },
                    algorithm: themeStore.themeConfig,
                }}>
                {/* <div class="bg" style={{ backgroundImage: 'url(' + themeStore.bgImageList[themeStore.state.backgroundImageIndex] + ')' }}> */}
                <Spin spinning={loading.value}>
                    <div style={{ "min-height": "200px" }}>
                        <router-view></router-view>
                    </div>
                </Spin>
                {/* </div> */}
            </ConfigProvider>
        )
    }
})