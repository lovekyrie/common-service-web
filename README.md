# common-service-web

## Project setup
```
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm run serve
```

### Compiles and minifies for production
```
pnpm run build
```

### Lints and fixes files
```
pnpm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---

## 微前端架构 (qiankun)

本项目已集成 qiankun 微前端架构，采用 pnpm workspaces 实现主应用 + Vue2 子应用 + Vue3 子应用的混合架构。

### 项目结构

```
frontend/
├── pnpm-workspace.yaml          # pnpm workspaces 配置
├── package.json                 # 主应用依赖（qiankun、公共工具）
├── eslint.config.mjs           # 主应用 ESLint 配置（vueVersion: 2）
├── vue.config.js               # Vue CLI 多页面配置
├── public/
│   ├── micro-main.html          # qiankun 主应用 HTML 入口
│   ├── subapp-vue2.html         # Vue2 子应用独立访问入口
│   └── subapp-vue3.html         # Vue3 子应用独立访问入口
├── src/                        # 主应用源码
│   ├── micro-main.ts           # qiankun 主应用入口
│   └── MicroMainApp.vue        # 主应用根组件
├── vue2-application/           # Vue2 子应用（独立 package.json）
│   ├── package.json            # Vue2 依赖（vue, element-ui, vuex, vue-router@3）
│   ├── eslint.config.mjs       # Vue2 ESLint 配置（vueVersion: 2）
│   ├── life-cycle-vue2.ts      # qiankun 生命周期入口
│   ├── public-path.ts          # qiankun 资源路径配置
│   ├── App.vue
│   ├── main.ts
│   ├── router/
│   ├── store/
│   └── views/
└── vue3-application/           # Vue3 子应用（独立 package.json）
    ├── package.json            # Vue3 依赖（vue@3, pinia, element-plus, vue-router@4）
    ├── eslint.config.mjs       # Vue3 ESLint 配置（vue: true）
    ├── life-cycle-vue3.ts     # qiankun 生命周期入口
    ├── App.vue
    ├── main.ts
    ├── router/
    ├── store/
    └── views/
```

### 依赖隔离（pnpm workspaces）

每个子应用拥有独立的 `package.json` 和 `node_modules`：

| 应用 | Vue 版本 | UI 库 | 路由 | 状态管理 |
|------|---------|-------|------|---------|
| 主应用 | 2.x | - | - | - |
| vue2-application | 2.x | element-ui | vue-router@3 | vuex |
| vue3-application | 3.x | element-plus | vue-router@4 | pinia |

### 启动方式

```bash
# 安装所有依赖（根目录 + 子应用）
pnpm install

# 启动微前端主应用（访问 http://localhost:8080/micro-main.html）
pnpm run serve:main

# Vue2 子应用独立访问
pnpm run serve
# 访问 http://localhost:8080/subapp-vue2.html

# Vue3 子应用独立访问
# 访问 http://localhost:8080/subapp-vue3.html
```

### 子应用切换

在 qiankun 主应用中，通过导航切换子应用：
- `/subapp/vue2` - 挂载 Vue2 子应用
- `/subapp/vue3` - 挂载 Vue3 子应用

### ESLint 配置

各应用独立 ESLint 配置，通过 pnpm workspaces 可对每个子应用单独运行检查：

```bash
# 主应用
npx eslint --config eslint.config.mjs src/

# Vue2 子应用
npx eslint --config vue2-application/eslint.config.mjs vue2-application/

# Vue3 子应用
npx eslint --config vue3-application/eslint.config.mjs vue3-application/
```

### 添加新子应用

1. 在对应目录创建子应用代码
2. 在 `vue.config.js` 的 `pages` 中添加入口配置
3. 在 `src/micro-main.ts` 的 `registerMicroApps` 中注册
4. 为子应用创建独立的 `eslint.config.mjs`

```typescript
// src/micro-main.ts
registerMicroApps([
  {
    name: 'vue2-subapp',
    entry: `${process.env.BASE_URL}subapp-vue2.html`,
    container: '#subapp-container',
    activeRule: location => location.pathname.startsWith('/subapp/vue2'),
    props: { onGlobalStateChange, setGlobalState },
  },
  {
    name: 'vue3-subapp',
    entry: `${process.env.BASE_URL}subapp-vue3.html`,
    container: '#subapp-container',
    activeRule: location => location.pathname.startsWith('/subapp/vue3'),
    props: { onGlobalStateChange, setGlobalState },
  },
])
```

### 最近更新

- **目录重组**：将 vue2-application、vue3-application 从 `src/` 移至根目录
- **pnpm workspaces**：实现子应用依赖隔离
- **ESLint 配置隔离**：主应用、Vue2、Vue3 各自独立 ESLint 配置
- **事件命名规范**：将 kebab-case 事件名统一改为 camelCase（符合 ESLint vue/custom-event-name-casing 规则）
- **Vue3 迁移修复**：移除 `.native` 修饰符（Vue3 已弃用）
