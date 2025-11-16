# WSL2 Sing-Box TUN 模式配置指南

## 📦 已安装内容

- ✅ Sing-box (v1.12.12) - 通过 Homebrew 安装
- ✅ 代理配置文件：`sing-box-wsl2.json`
- ✅ 启动脚本：`start-wsl2-proxy.sh`

## 🚀 使用方法

### 启动 TUN 模式（需要 sudo）

```bash
# 启动代理
proxy-start
# 或者
cd ~/project/common-service-web/shells
sudo ./start-wsl2-proxy.sh
```

### 管理命令

```bash
# 查看代理状态
proxy-status

# 启动代理（需要 sudo）
proxy-start

# 停止代理
proxy-stop

# 查看日志
proxy-log
```

## 📊 代理信息

- **模式**: TUN 全局透明代理
- **代理服务器**: `feng-fortitude.com:443`
- **虚拟网卡**: `tun0` (172.19.0.1/30)
- **特点**: 无需配置环境变量，自动接管所有网络流量

## 🌐 分流规则

- ✅ **国内网站** → 直连（baidu.com, taobao.com 等）
- ✅ **国外网站** → 通过 naive-proxy
- ✅ **私有 IP** → 直连

## 🧪 测试代理

```bash
# 测试国内网站（应该直连）
curl -I https://www.baidu.com

# 测试国外网站（通过代理）
curl -I https://github.com

# 测试 Git（自动通过 TUN 代理）
git ls-remote https://github.com/torvalds/linux.git HEAD
```

## 📝 注意事项

### 1. TUN 模式需要 root 权限
每次启动都需要使用 `sudo`，这是因为 TUN 模式需要创建虚拟网卡。

### 2. 自动分流
- **无需配置环境变量**，TUN 模式自动接管所有流量
- 国内网站自动直连，国外网站自动走代理
- Git、npm、pnpm 等工具自动享受代理

### 3. 停止代理

```bash
proxy-stop
```

停止后，所有流量恢复为直连。

### 4. 与 Windows 解耦

当前配置只在 WSL2 中使用，与 Windows 系统完全独立：
- ✅ **WSL2**：使用 `sing-box-wsl2.json` (TUN 模式)
- 📄 **Windows**：保留 `sing-box-config.json` 供参考（未使用）

## 🔧 配置文件

### sing-box-wsl2.json
WSL2 TUN 模式配置，创建虚拟网卡 tun0，全局透明代理。

### sing-box-config.json  
Windows TUN 模式配置示例（保留供参考，当前未使用）。

## 📂 文件列表

- `sing-box-wsl2.json` - WSL2 TUN 模式配置
- `sing-box-config.json` - Windows 配置示例（未使用）
- `start-wsl2-proxy.sh` - WSL2 启动脚本
- `README-PROXY.md` - 本文档

## 🐛 故障排查

### 代理无法连接

```bash
# 检查进程
ps aux | grep sing-box

# 查看日志
tail -n 50 /tmp/sing-box.log

# 重启代理
proxy-stop
proxy-start
```

### 某些网站无法访问

1. 检查日志查看错误信息
2. 确认代理服务器状态
3. 尝试使用 SOCKS 代理：`export ALL_PROXY="socks5://127.0.0.1:7891"`

### 更新规则文件

```bash
# 删除缓存的规则文件
rm -rf ~/.cache/sing-box/

# 重启 sing-box 会自动重新下载
proxy-stop
proxy-start
```

## 📚 参考文档

- [Sing-box 官方文档](https://sing-box.sagernet.org/)
- [Naive-proxy 文档](https://github.com/klzgrad/naiveproxy)
- [配置迁移指南](https://sing-box.sagernet.org/migration/)

---

最后更新：2025-11-15

