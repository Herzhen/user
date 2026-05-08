
# 1. 选择更稳健的基础镜像版本，推荐使用 18 而非最新的 latest
FROM node:18-slim

# 2. 设置容器内的工作目录
WORKDIR /server

# 3. 复制依赖定义文件并安装
# 分层构建，优化缓存
COPY package*.json ./
RUN npm install 

# 4. 复制所有项目文件到工作目录
COPY . .

# 5. 声明容器运行时监听的端口 (云托管要求监听 80 端口)
EXPOSE 80

# 6. 定义容器启动时的命令
CMD [ "node", "server.js" ]



