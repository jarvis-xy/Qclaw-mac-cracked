# QClaw Patcher (Unofficial)

> ⚠️ **Disclaimer**: This tool is for educational purposes only. Please support the original developers by obtaining a legitimate invitation code when possible.

A fully automated patcher for **QClaw** (Tencent's AI Desktop Agent) to unlock access without an invitation code and disable auto-updates.

## Features

- �� **Unlock Access**: Bypasses the "Invitation Code Required" modal.
- 🛡️ **Disable Updates**: Sets version to `99.9.9` to prevent auto-updates from reverting the patch.
- 🍏 **macOS Support**: Automatically handles `xattr` quarantine removal and code re-signing.
- 📦 **Dependency Free**: Uses built-in Node.js modules and custom ASAR packer/unpacker (no `npm install` needed).

## Usage

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- QClaw installed (v0.1.1 or compatible).

### Run the Patcher

1. Open your terminal.
2. Run the script:

```bash
# macOS (Requires sudo to modify /Applications)
sudo node patch.js
```

## How it works

1. **Backs up** your original `app.asar` to `app.asar.bak`.
2. **Unpacks** the application resources.
3. **Injects** a bypass script into the `InviteCodeModal` component (simulates a successful verification signal every 500ms).
4. **Modifies** `package.json` version to `99.9.9`.
5. **Repacks** the resources.
6. **(macOS)** Re-signs the application to pass Gatekeeper checks.

## Restore

To restore the original version, simply rename `app.asar.bak` back to `app.asar` in the resources directory.
