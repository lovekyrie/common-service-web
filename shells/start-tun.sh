#!/bin/bash

# sing-box TUN 模式启动脚本
# 使用方法: ./start-tun.sh

CONFIG_FILE="/Users/duanyupeng/project/study/common-service-web/shells/sing-box-config.json"

echo "🚀 正在启动 sing-box TUN 模式..."
echo "📝 配置文件: $CONFIG_FILE"
echo ""

# 检查是否有 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo "❌ TUN 模式需要 root 权限，请使用 sudo 运行:"
    echo "   sudo ./start-tun.sh"
    exit 1
fi

# 检查配置文件
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 配置文件不存在: $CONFIG_FILE"
    exit 1
fi

# 验证配置
echo "🔍 验证配置文件..."
if ! sing-box check -c "$CONFIG_FILE"; then
    echo "❌ 配置文件验证失败"
    exit 1
fi

echo "✅ 配置文件验证通过"
echo ""

# 停止已有的 sing-box 进程
if pgrep -x "sing-box" > /dev/null; then
    echo "⚠️  检测到已有 sing-box 进程，正在停止..."
    pkill -9 sing-box
    sleep 1
fi

# 启动 sing-box
echo "🎯 启动 sing-box..."
echo "📊 日志文件: /tmp/sing-box.log"
echo "⏹️  停止方法: sudo pkill sing-box"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

sing-box run -c "$CONFIG_FILE"

