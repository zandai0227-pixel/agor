<img src="apps/agor-docs/public/logo-mark.svg" alt="Agor logo" width="92" height="92" />

# Agor · 主要模块中文界面

本仓库基于 Agor，仅将主要模块、导航和常用入口改为简体中文。保留 Codex、Claude、MCP、Git、Branches、Worktree、Artifacts、Token 等技术术语，不改接口、配置键、权限策略或业务流程。

汉化已在前端源码中生效：从本分支构建并安装后，无需另打补丁，也不依赖浏览器翻译。此次不是全量汉化，深层技术设置、模型输出、终端日志及部分说明仍保留英文。

> **不要用 `npm install -g agor-live` 安装本仓库汉化版。** 该命令安装的是上游 npm 包，不包含本仓库未发布的修改。上游预构建镜像同理。请按下方方式从本仓库构建。

[上游项目说明](README.upstream.md) · [项目许可证](LICENSE) · [贡献说明](CONTRIBUTING.md)

## 安装汉化版

当前汉化分支为 `feat/zh-cn-main-ui`。合并进 `main` 后，下面克隆命令的分支名可以改为 `main`。

### 方式一：Docker 生产安装

需要 Git、Docker 和 Docker Compose。现有 Dockerfile 中部分系统工具使用 Linux amd64 二进制；这套镜像流程面向 amd64，不承诺原生 ARM 构建。

```bash
git clone --branch feat/zh-cn-main-ui --single-branch https://github.com/zandai0227-pixel/agor.git
cd agor

docker compose -f docker-compose.prod.yml up -d --build
```

启动后访问 `http://localhost:3030`。服务器部署时，将 localhost 换成服务器地址；对外使用前配置 HTTPS 和访问控制。

本仓库的 `docker-compose.prod.yml` 已使用项目原有的 **`production-source`** 构建目标：构建当前 checkout 的 UI 和后端，再将本地生成的发布包安装进镜像，而不是安装上游 npm 包。

首次启动采用原项目的管理员初始化机制。未设置 `AGOR_ADMIN_PASSWORD` 时，随机初始凭据保存在容器内：

```bash
docker compose -f docker-compose.prod.yml exec agor-prod \
  cat /home/agor/.agor/admin-credentials
```

请仅在自己的终端查看凭据，首次登录按提示修改密码。原有数据库、配置及凭据持久化机制不变。

### 方式二：从源码构建本地安装包

适用于项目支持的 macOS / Linux 环境，需要 Node.js >= 22.12、Git 和 pnpm 11.17.0。Windows 原生安装不在发布包支持范围内，可使用合适的 Linux 环境。

```bash
git clone --branch feat/zh-cn-main-ui --single-branch https://github.com/zandai0227-pixel/agor.git
cd agor

npm install -g pnpm@11.17.0
pnpm install --frozen-lockfile
bash packages/agor-live/build.sh --skip-install

# 同时安装当前源码生成的 client 和主包，不依赖上游发布顺序。
npm install -g --ignore-scripts --no-audit --no-fund \
  ./packages/agor-live/release/agor-live-client-*.tgz \
  ./packages/agor-live/release/agor-live-[0-9]*.tgz

# 以下初始化命令用于全新安装。
agor init
agor daemon start
agor open
```

复用项目原有的 `packages/agor-live/build.sh`，该脚本构建前端并打入 `agor-live` 安装包；这里不发布到 npm，也不需要额外运行汉化脚本。全局安装可能替换机器上已有的 `agor-live`，已有实例请先备份数据、停止旧 daemon，再更新。

### 开发环境

检出本分支后，沿用项目原有开发流程即可看到中文入口：

```bash
docker compose up --build
```

开发环境与生产环境的端口、默认账号及隔离设置不同，不要将开发 Compose 直接作为公网生产部署。

## 更新

Docker 方式：在原部署目录和同一 Compose 项目中拉取已确认的汉化分支，然后重新构建，避免复用旧的上游镜像。

```bash
git pull --ff-only
docker compose -f docker-compose.prod.yml up -d --build
```

保留原来的 Compose 项目名、环境变量和持久化卷。不要为更新 UI 删除数据库或执行 `docker compose down -v`。源码安装方式需要重新构建本地发布包、安装并重启 daemon。直接升级上游 npm 包会覆盖本地汉化版本。

## 汉化范围

- 首页的新建入口与引导项、看板切换与筛选、我的会话、知识库入口。
- 顶部设置菜单、个人设置与退出登录、登录表单常用按钮。
- 桌面及手机设置导航：工作区、看板、代码仓库、AI 队友、卡片、偏好设置、AI 工具、消息通道、用户管理等。
- 页面语言为 `zh-CN`，Ant Design 使用简体中文 locale。技术词和原始业务标识保持不变。

源码及文案测试一同维护。完整功能介绍和原项目链接保留在 [README.upstream.md](README.upstream.md)；其中的 npm、Homebrew 或上游镜像安装入口不等于本仓库汉化版安装入口。

## 许可证与来源

沿用原项目 [Business Source License 1.1](LICENSE)（`BUSL-1.1`）。原项目署名、许可证和使用限制均保留，汉化不改变授权条件。上游为 [preset-io/agor](https://github.com/preset-io/agor)。
