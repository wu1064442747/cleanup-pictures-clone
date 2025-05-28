# Vercel 自动部署指南

本指南将帮助你设置从GitHub到Vercel的自动部署。

## 🚀 快速开始

### 1. 准备GitHub仓库

确保你的代码已经推送到GitHub：

```bash
git add .
git commit -m "feat: 添加Vercel自动部署配置"
git push origin main
```

### 2. 连接Vercel

1. 访问 [Vercel官网](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择你的GitHub仓库 `cleanup-pictures-clone`
4. Vercel会自动检测到这是一个Next.js项目

### 3. 配置环境变量

在Vercel项目设置中添加以下环境变量：

```env
OPENROUTER_API_KEY=你的OpenRouter API密钥
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
```

**设置步骤：**
1. 进入Vercel项目控制台
2. 点击 "Settings" 标签
3. 在左侧菜单选择 "Environment Variables"
4. 添加上述环境变量
5. 点击 "Save"

### 4. 部署

点击 "Deploy" 按钮，Vercel将会：
1. 从GitHub拉取代码
2. 安装依赖
3. 运行构建
4. 部署应用

## 🔄 自动部署流程

每次你推送代码到 `main` 分支时，Vercel会自动：

1. **检测更改** - Vercel监听GitHub仓库的推送事件
2. **构建项目** - 运行 `npm run build`
3. **部署** - 将构建结果部署到Vercel CDN
4. **通知** - 通过邮件或Slack通知部署状态

## 📋 部署检查清单

在每次部署前，确保：

- [ ] 所有环境变量已正确设置
- [ ] 代码通过本地测试（`npm run lint`）
- [ ] 构建成功（`npm run build`）
- [ ] API路由正常工作
- [ ] 没有敏感信息在代码中硬编码

## 🛠️ 高级配置

### GitHub Actions（可选）

如果你想要更多控制，可以使用GitHub Actions：

1. 确保 `.github/workflows/deploy.yml` 文件存在
2. 在GitHub仓库设置中添加以下Secrets：
   - `VERCEL_TOKEN` - Vercel API Token
   - `ORG_ID` - Vercel组织ID
   - `PROJECT_ID` - Vercel项目ID
   - `OPENROUTER_API_KEY` - OpenRouter API密钥
   - `OPENROUTER_BASE_URL` - OpenRouter基础URL
   - `OPENROUTER_MODEL` - OpenRouter模型名称

### 分支部署

- `main` 分支 → 生产环境
- `develop` 分支 → 预览环境
- Pull Requests → 临时预览环境

### 自定义域名

1. 在Vercel项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 配置DNS记录指向Vercel

## 🔍 监控和调试

### 部署日志

在Vercel控制台中查看：
1. Functions标签 - 查看API路由日志
2. Edge Network标签 - 查看CDN性能
3. Analytics标签 - 查看访问统计

### 常见问题

**构建失败**
- 检查环境变量是否正确设置
- 查看构建日志中的错误信息
- 确保依赖项版本兼容

**API路由不工作**
- 确认环境变量已设置
- 检查API路由文件路径是否正确
- 查看Function日志

**性能问题**
- 使用Vercel Analytics监控
- 优化图片和静态资源
- 检查API响应时间

## 📚 相关链接

- [Vercel文档](https://vercel.com/docs)
- [Next.js部署指南](https://nextjs.org/docs/deployment)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [OpenRouter API文档](https://openrouter.ai/docs)

## 🆘 故障排除

如果遇到问题：

1. 检查Vercel部署日志
2. 确认环境变量设置
3. 本地测试API路由
4. 联系支持团队

---

部署成功后，你的应用将通过以下URL访问：
- 生产环境：`https://your-project.vercel.app`
- 自定义域名：`https://your-domain.com` 