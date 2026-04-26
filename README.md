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

本项目已集成 qiankun 微前端架构，当前仓库通过 Vue CLI 多页面同时提供主应用和 Vue2 子应用入口。

### 项目结构

```
frontend/
├── public/
│   ├── micro-main.html          # 主应用 HTML 入口
│   └── subapp-vue2.html        # 子应用独立访问入口
├── src/
│   ├── micro-main.ts            # qiankun 主应用入口
│   ├── micro-apps/
│   │   ├── life-cycle.ts       # qiankun 子应用生命周期
│   │   └── public-path.ts      # qiankun 子应用资源路径
│   ├── MicroMainApp.vue         # 主应用根组件
│   └── App.vue                  # Vue2 子应用根组件
└── vue.config.js               # 已更新支持多入口
```

### 启动方式

```bash
# 启动多页面开发服务
pnpm run serve:main

# qiankun 主应用
# 访问 http://localhost:8080/micro-main.html

# Vue2 子应用独立访问
# 访问 http://localhost:8080/subapp-vue2.html
```

### 架构说明

- **主应用**: `micro-main.html` 页面作为 qiankun 容器
- **子应用**: `subapp-vue2.html` 页面以 `life-cycle.ts` 作为入口，导出 qiankun 生命周期
- **激活规则**: 访问 `/subapp/vue2` 时挂载 Vue2 子应用
- **样式隔离**: qiankun sandbox 启用严格样式隔离
- **预加载**: 启用 prefetch 预加载子应用资源

### 添加新子应用

在 `src/micro-main.ts` 的 `registerMicroApps` 中注册新子应用：

```typescript
registerMicroApps([
  {
    name: 'common-service-web-subapp-vue2',
    entry: `${process.env.BASE_URL}subapp-vue2.html`,
    container: '#subapp-container',
    activeRule: location => location.pathname.startsWith('/subapp/vue2'),
  },
  // 添加新的子应用...
])
```
