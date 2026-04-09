# Changelog

## [2.7.3-fork]

### Added

- Add Chinese (zh-CN) localization for all UI strings, covering settings (100+ strings), 13 commands, file creation modal, and navigation hints.
- Add i18n framework with type-safe locale definitions (`src/i18n/`), supporting English and Simplified Chinese.
- Add `build:local` and `copy-to-local` scripts for streamlined local development.

### Changed

- Change esbuild output directory from root to `dist/`, with explicit copying of `manifest.json` and `styles.css`.
- Sync with upstream v2.7.3.

---

- 新增简体中文（zh-CN）本地化，覆盖设置页（100+ 条文本）、13 个命令、文件创建弹窗、导航提示等所有 UI 文本。
- 新增 i18n 框架，支持类型安全的翻译定义（`src/i18n/`），支持英文和简体中文。
- 新增 `build:local` 和 `copy-to-local` 脚本，简化本地开发流程。
- 将 esbuild 输出目录从根目录改为 `dist/`，显式复制 `manifest.json` 和 `styles.css`。
- 同步上游 v2.7.3。
