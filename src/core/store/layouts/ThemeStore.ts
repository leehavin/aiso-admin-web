import { defineStore } from "pinia";
import { computed, reactive, onMounted, Ref } from "vue";
import { theme as antdTheme } from "ant-design-vue";
import AppConsts from "@/utils/AppConsts.js";
import { AliasToken } from "ant-design-vue/es/theme/internal";
import { MappingAlgorithm } from "ant-design-vue/es/config-provider/context";
// import Img0 from "@/assets/images/login-1.jpg";
// import Img1 from "@/assets/images/bg-1.jpg";
// import Img2 from "@/assets/images/bg-2.jpg";
// import Img3 from "@/assets/images/bg-3.jpg";
// import Img4 from "@/assets/images/bg-4.jpg";
// import Img5 from "@/assets/images/bg-5.jpg";
// import Img6 from "@/assets/images/bg-6.jpg";
// import Img7 from "@/assets/images/bg-7.jpg";
// import Img8 from "@/assets/images/bg-8.jpg";
// import Img9 from "@/assets/images/bg-9.jpg";
// import Img10 from "@/assets/images/bg-10.jpg";
// import Img11 from "@/assets/images/bg-11.jpg";
// import Img12 from "@/assets/images/bg-12.jpg";

export type ThemeName = "light" | "dark" | "compact";

interface IState {
    /**
     * 是否暗黑
     */
    isDark: boolean;
    /**
     * 全局 主题
     */
    tokenTheme?: AliasToken;
    /**
     * 菜单主题
     */
    menuTheme: IMenuTheme;
    /**
     * 背景图索引
     */
    backgroundImageIndex: number;
}

/**
 * 菜单主题接口
 */
interface IMenuTheme {
    // 菜单项背景色
    colorItemBg?: string;
    // 背景色 hover
    colorItemBgHover?: string;
    // 选中背景色
    colorItemBgSelected?: string;
    // 文本色
    colorItemText?: string;
    // 文本 hover
    colorItemTextHover?: string;
    // 文本选中
    colorItemTextSelected?: string;
    // 子菜单背景色
    colorSubItemBg?: string;
    // 菜单是否为暗色
    isDark?: boolean;
}

export default defineStore("ThemeStore", () => {
    var tokenTheme = {} as AliasToken;

    // 菜单主题集合
    const menuThemeList: IMenuTheme[] = [
        // 白色
        {},
        // antd 暗色菜单
        {
            colorItemBg: "#001529",
            colorItemBgHover: "rgba(0, 0, 0, 0.06)",
            colorItemText: "#ffffffa3",
            colorItemTextHover: "#ffffff",
            colorItemTextSelected: "#ffffff",
            colorSubItemBg: "#001529",
            isDark: true,
        },
        // element+ 官方自定义颜色风格
        {
            colorItemBg: "#545c64",
            colorItemBgHover: "rgba(0, 0, 0, 0.06)",
            colorItemText: "#ffffffa3",
            colorItemTextHover: "#fff",
            colorItemTextSelected: "#fff",
            colorSubItemBg: "#545c64",
            isDark: true,
        },
        // iview 菜单风格
        {
            colorItemBg: "#191a23",
            colorItemBgHover: "rgba(0, 0, 0, 0.06)",
            colorItemText: "#ffffffa3",
            colorItemTextHover: "#fff",
            colorItemTextSelected: "#fff",
            colorSubItemBg: "#191a23",
            isDark: true,
        },
    ];

    // 品牌色集合
    const colorPrimaryList: AliasToken[] = [
        {
            colorPrimary: "#2f54eb",
            colorLink: "#2f54eb",
            colorLinkHover: "#2f54eb",
            colorLinkActive: "#2f54eb"
        } as AliasToken,
        {
            colorPrimary: "#1677FF",
            colorLink: "#1677FF",
            colorLinkHover: "#1677FF",
            colorLinkActive: "#1677FF",
        } as AliasToken,
        {
            colorPrimary: "#5A54F9",
            colorLink: "#5A54F9",
            colorLinkHover: "#5A54F9",
            colorLinkActive: "#5A54F9",
        } as AliasToken,
        {
            colorPrimary: "#9E339F",
            colorLink: "#9E339F",
            colorLinkHover: "#9E339F",
            colorLinkActive: "#9E339F",
        } as AliasToken,
        {
            colorPrimary: "#ED4192",
            colorLink: "#ED4192",
            colorLinkHover: "#ED4192",
            colorLinkActive: "#ED4192",
        } as AliasToken,
        {
            colorPrimary: "#E0282E",
            colorLink: "#E0282E",
            colorLinkHover: "#E0282E",
            colorLinkActive: "#E0282E",
        } as AliasToken,
        {
            colorPrimary: "#F4801A",
            colorLink: "#F4801A",
            colorLinkHover: "#F4801A",
            colorLinkActive: "#F4801A",
        } as AliasToken,
        {
            colorPrimary: "#f0e04b",
            colorLink: "#f0e04b",
            colorLinkHover: "#f0e04b",
            colorLinkActive: "#f0e04b",
        } as AliasToken,
        {
            colorPrimary: "#F2BD27",
            colorLink: "#F2BD27",
            colorLinkHover: "#F2BD27",
            colorLinkActive: "#F2BD27",
        } as AliasToken,
        {
            colorPrimary: "#00B96B",
            colorLink: "#00B96B",
            colorLinkHover: "#00B96B",
            colorLinkActive: "#00B96B",
        } as AliasToken,
        {
            colorPrimary: "#393D49",
            colorLink: "#393D49",
            colorLinkHover: "#393D49",
            colorLinkActive: "#393D49",
        } as AliasToken,
        {
            colorPrimary: "#009688",
            colorLink: "#009688",
            colorLinkHover: "#009688",
            colorLinkActive: "#009688",
        } as AliasToken,
        {
            colorPrimary: "#63BA79",
            colorLink: "#63BA79",
            colorLinkHover: "#63BA79",
            colorLinkActive: "#63BA79",
        } as AliasToken
    ];

    // /**
    //  * 背景图片
    //  */
    // const bgImageList: string[] = [
    //   Img0,
    //   Img1,
    //   Img2,
    //   Img3,
    //   Img4,
    //   Img5,
    //   Img6,
    //   Img7,
    //   // Img8,
    //   // Img9,
    //   // Img10,
    //   // Img11,
    //   // Img12,
    // ];

    // 状态定义
    const state = reactive<IState>({
        isDark: false,
        tokenTheme,
        menuTheme: {},
        backgroundImageIndex: -1,
    });

    onMounted(() => {
        let index = ThemeCacheUtil.getMenuCustomThemesIndex();
        state.menuTheme = menuThemeList[index];
        let isDark = ThemeCacheUtil.getIsDark();
        state.isDark = isDark;
        let colorPrimary = ThemeCacheUtil.getColorPrimary();
        if (colorPrimary) {
            state.tokenTheme! = colorPrimary;
        }
    });

    // 主题 类型 MappingAlgorithm

    //
    const getAlgorithm = (themes: ThemeName[] = []) =>
        themes.map((theme) => {
            if (theme === "dark") {
                return antdTheme.darkAlgorithm;
            }

            if (theme === "compact") {
                return antdTheme.compactAlgorithm
            }

            return antdTheme.defaultAlgorithm;
        });

    const themeConfig = computed(() => (state.isDark ? getAlgorithm(["dark"]) : getAlgorithm(["light"])));

    /**
     * 主题改变
     * @param isDark
     */
    function changeTheme(isDark: boolean) {
        state.isDark = isDark;
        // 重置背景色，前景色
        changeColorPrimary({
            colorBgBase: "",
            colorTextBase: ""
        } as AliasToken);
        ThemeCacheUtil.setIsDark(isDark);
    }

    /**
     * 切换菜单主题
     * @param index
     */
    function changeMenuTheme(index: number) {
        state.menuTheme = menuThemeList[index];
        ThemeCacheUtil.setMenuCustomThemesIndex(index);
    }

    /**
     * 改变主色 品牌色
     */
    function changeColorPrimary(color: AliasToken) {
        state.tokenTheme! = { ...state.tokenTheme!, ...color };
        ThemeCacheUtil.setColorPrimary(state.tokenTheme);
    }

    return {
        state,
        themeConfig,
        menuThemeList,
        colorPrimaryList,
        // bgImageList,
        changeTheme,
        changeMenuTheme,
        changeColorPrimary,
    };
});

/**
 * 主题缓存工具
 */
class ThemeCacheUtil {
    /**
     * 持久化保存自定义颜色状态
     * @param index
     */
    static setMenuCustomThemesIndex(index: number) {
        localStorage.setItem(`${AppConsts.appPrefix}_menu_custom_themes_index`, index.toString());
    }

    /**
     * 获取 index
     * @returns
     */
    static getMenuCustomThemesIndex(): number {
        var index = localStorage.getItem(`${AppConsts.appPrefix}_menu_custom_themes_index`);
        if (index == null || index == undefined || index == "") return 0;
        return parseInt(index);
    }

    /**
     * 设置主题
     * @param isDark
     */
    static setIsDark(isDark: boolean) {
        localStorage.setItem(`${AppConsts.appPrefix}_theme_is_dark`, (isDark ? 1 : 0).toString());
    }

    /**
     * 获取主题
     * @returns
     */
    static getIsDark() {
        var result = localStorage.getItem(`${AppConsts.appPrefix}_theme_is_dark`);
        return result == "1";
    }

    /**
     * 保存品牌色
     */
    static setColorPrimary(color: AliasToken) {
        localStorage.setItem(`${AppConsts.appPrefix}_color_primary`, JSON.stringify(color));
    }

    /**
     * 读取品牌色
     * @returns
     */
    static getColorPrimary(): AliasToken | null {
        var result = localStorage.getItem(`${AppConsts.appPrefix}_color_primary`);
        if (!result) {
            return null;
        }

        try {
            return JSON.parse(result) as AliasToken;
        } catch (error) {
            return null;
        }
    }
}
