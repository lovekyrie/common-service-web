#!/bin/bash

# 获取Windows宿主机IP
WINDOWS_IP=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')

echo "检测到Windows宿主机IP: $WINDOWS_IP"

# 配置文件路径
CONFIG_FILE="/home/mikasa/project/common-service-web/shells/sing-box-wsl2.json"

# 备份原配置
cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"

# 更新配置文件中的server地址
sed -i "s/\"server\": \"[0-9.]*\"/\"server\": \"$WINDOWS_IP\"/" "$CONFIG_FILE"

echo "已更新配置文件，Windows IP设置为: $WINDOWS_IP"

# 测试连接
echo "测试连接到 $WINDOWS_IP:8008..."
timeout 3 bash -c "cat < /dev/null > /dev/tcp/$WINDOWS_IP/8008" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ 成功连接到Windows的Socks5代理"
else
    echo "✗ 无法连接到Windows的Socks5代理"
    echo ""
    echo "请检查："
    echo "1. Windows的navieproxy是否正在运行并监听 0.0.0.0:8008"
    echo "2. Windows防火墙是否允许WSL2访问8008端口"
    echo "3. 运行以下命令测试端口："
    echo "   nc -zv $WINDOWS_IP 8008"
fi

