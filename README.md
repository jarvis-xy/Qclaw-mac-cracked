# QClaw Patcher (Unofficial)

[English](README_EN.md) | [中文](README_CN.md)

> ⚠️ **Disclaimer / 免责声明**: 
> This tool is for educational purposes only. Please support the original developers by obtaining a legitimate invitation code when possible.
> 本工具仅供学习交流使用。请支持正版，尽可能通过正规途径获取邀请码。

A fully automated patcher for **[QClaw](https://claw.guanjia.qq.com/)** (Tencent's AI Desktop Agent) to unlock access without an invitation code and disable auto-updates.
全自动破解 **[QClaw](https://claw.guanjia.qq.com/)** (腾讯 AI 桌面助手) 的补丁工具，可绕过邀请码验证并禁用自动更新。

## Features / 功能特性

- 🔓 **Unlock Access**: Bypasses the "Invitation Code Required" modal.
  **解锁访问**：绕过“请输入邀请码”弹窗。
- 🛡️ **Disable Updates**: Sets version to `99.9.9` to prevent auto-updates from reverting the patch.
  **禁用更新**：将版本号修改为 `99.9.9`，防止自动更新覆盖补丁。
- 🍏 **macOS Support**: Automatically handles `xattr` quarantine removal and code re-signing.
  **macOS 支持**：自动处理 `xattr` 隔离属性移除和代码重签名。
- 📦 **Dependency Free**: Uses built-in Node.js modules and custom ASAR packer/unpacker (no `npm install` needed).
  **零依赖**：使用 Node.js 内置模块和自定义 ASAR 打包/解包工具（无需 `npm install`）。

## Usage / 使用方法

### Prerequisites / 前置要求
- [Node.js](https://nodejs.org/) installed. (已安装 Node.js)
- [QClaw](https://claw.guanjia.qq.com/) installed (v0.1.1 or compatible). (已安装 QClaw)

### Installation & Run / 安装与运行

1. **Open Terminal** and enter your Desktop (to avoid permission errors):
   **打开终端** 并进入桌面目录（避免权限错误）：
   ```bash
   cd ~/Desktop
   ```

2. **Clone** this repository:
   **克隆** 本仓库：
   ```bash
   git clone https://github.com/jarvis-xy/Qclaw-mac-cracked.git
   ```

3. **Enter the project directory**:
   **进入项目目录**：
   ```bash
   cd Qclaw-mac-cracked
   ```

4. **Run the patcher**:
   **运行补丁**：
   ```bash
   # macOS (Requires sudo to modify /Applications | 需要 sudo 权限以修改应用程序目录)
   sudo node patch.js
   ```

## How it works / 原理说明

1. **Backs up** your original `app.asar` to `app.asar.bak`.
   **备份** 原始 `app.asar` 文件为 `app.asar.bak`。
2. **Unpacks** the application resources.
   **解包** 应用程序资源文件。
3. **Injects** a bypass script into the `InviteCodeModal` component (simulates a successful verification signal every 500ms).
   **注入** 绕过脚本到 `InviteCodeModal` 组件（每 500ms 模拟一次成功的验证信号）。
4. **Modifies** `package.json` version to `99.9.9`.
   **修改** `package.json` 中的版本号为 `99.9.9`。
5. **Repacks** the resources.
   **重新打包** 资源文件。
6. **(macOS)** Re-signs the application to pass Gatekeeper checks.
   **(macOS)** 对应用程序进行重签名以通过 Gatekeeper 检查。

## Restore / 恢复

To restore the original version, simply rename `app.asar.bak` back to `app.asar` in the resources directory.
要恢复原始版本，只需将资源目录中的 `app.asar.bak` 重命名回 `app.asar` 即可。
