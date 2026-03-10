# QClaw Patcher (Unofficial)

[English](README_EN.md) | [中文](README_CN.md)

> ⚠️ **免责声明**: 本工具仅供学习交流使用。请支持正版，尽可能通过正规途径获取邀请码。

全自动破解 **[QClaw](https://claw.guanjia.qq.com/)** (腾讯 AI 桌面助手) 的补丁工具，可绕过邀请码验证并禁用自动更新。

## 功能特性

- 🔓 **解锁访问**：绕过“请输入邀请码”弹窗。
- 🛡️ **禁用更新**：将版本号修改为 `99.9.9`，防止自动更新覆盖补丁。
- 🍏 **macOS 支持**：自动处理 `xattr` 隔离属性移除和代码重签名。
- 📦 **零依赖**：使用 Node.js 内置模块和自定义 ASAR 打包/解包工具（无需 `npm install`）。

## 使用方法

### 前置要求
- 已安装 [Node.js](https://nodejs.org/)。
- 已安装 [QClaw](https://claw.guanjia.qq.com/) (v0.1.1 或兼容版本)。

### 安装与运行

1. **打开终端** 并进入桌面目录（避免权限错误）：
   ```bash
   cd ~/Desktop
   ```

2. **克隆** 本仓库：
   ```bash
   git clone https://github.com/dulipeng069/Qclaw-mac-cracked.git
   ```

3. **进入项目目录**：
   ```bash
   cd Qclaw-mac-cracked
   ```

4. **运行补丁**：
   ```bash
   # macOS (需要 sudo 权限以修改应用程序目录)
   sudo node patch.js
   ```

## 原理说明

1. **备份** 原始 `app.asar` 文件为 `app.asar.bak`。
2. **解包** 应用程序资源文件。
3. **注入** 绕过脚本到 `InviteCodeModal` 组件（每 500ms 模拟一次成功的验证信号）。
4. **修改** `package.json` 中的版本号为 `99.9.9`。
5. **重新打包** 资源文件。
6. **(macOS)** 对应用程序进行重签名以通过 Gatekeeper 检查。

## 恢复

要恢复原始版本，只需将资源目录中的 `app.asar.bak` 重命名回 `app.asar` 即可。
