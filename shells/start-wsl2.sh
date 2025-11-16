#!/bin/bash

# WSL2 Sing-Box TUN 模式启动脚本

cd "$(dirname "$0")"

# sing-box 完整路径（Homebrew 安装）
SING_BOX="/home/linuxbrew/.linuxbrew/bin/sing-box"

echo "🚀 正在启动 WSL2 Sing-Box TUN 模式..."

# 检查 sing-box 是否存在
if [ ! -x "$SING_BOX" ]; then
    echo "❌ 找不到 sing-box: $SING_BOX"
    echo "请先安装: brew install sing-box"
    exit 1
fi

# 检查是否有 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  TUN 模式需要 root 权限"
    echo "🔄 正在使用 sudo 重新启动..."
    echo ""
    exec sudo bash "$0" "$@"
fi

# 验证配置
echo "🔍 验证配置文件..."
if ! $SING_BOX check -c sing-box-wsl2.json 2>&1 | grep -q "FATAL"; then
    echo "✅ 配置验证通过"
else
    echo "❌ 配置文件有误"
    exit 1
fi
echo ""

# 停止已有进程
if pgrep -f "sing-box.*wsl2" > /dev/null; then
    echo "⚠️  停止已有的 sing-box 进程..."
    pkill -9 -f "sing-box.*wsl2"
    sleep 1
fi

echo "📝 配置: sing-box-wsl2.json"
echo "🌐 TUN 虚拟网卡: tun0"
echo "📊 分流: 国内直连 | 国外代理"
echo "⏹️  停止: sudo pkill -f 'sing-box.*wsl2'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 启动 sing-box
$SING_BOX run -c sing-box-wsl2.json

