# 部署指南

## GitHub Pages 自动部署

本项目已配置GitHub Actions工作流，可以自动部署到GitHub Pages。

### 工作流程说明

当代码推送到`main`或`master`分支时，GitHub Actions会自动执行以下步骤：

1. 检出代码
2. 设置Node.js环境
3. 安装项目依赖
4. 构建项目
5. 将构建结果部署到`gh-pages`分支

### 手动部署

您也可以在GitHub仓库的Actions标签页中手动触发部署工作流。

### 首次部署注意事项

首次部署后，您需要在GitHub仓库设置中启用GitHub Pages：

1. 进入仓库的Settings > Pages
2. 在Source下拉菜单中选择`gh-pages`分支
3. 点击Save按钮

### 访问已部署的应用

部署完成后，您可以通过以下URL访问应用：

```
https://<您的GitHub用户名>.github.io/3d-minesweeper/
```

## 本地预览生产构建

您可以在本地预览生产构建：

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```