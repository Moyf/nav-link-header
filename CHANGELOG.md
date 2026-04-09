# Changelog

## [2.7.3-fork.1]

### Added

- Add complete Chinese (zh-CN) localization for all user-facing strings, including settings (100+ entries), 13 commands, file creation modal, and navigation UI.
- Add i18n framework with type-safe locale definitions (`src/i18n/`), supporting English and Simplified Chinese.
- Add tabbed settings navigation (Common, Displayed views, Annotated links, Pinned annotations, Property links, Periodic notes, Folder links).
- Add collapsible folder link rules with click-to-rename support.
- Add explicit i18n tip/tooltip fields for supplementary guidance in settings.
- Add plugin usage guide at the top of settings with GitHub link.

### Changed

- Redesign settings page layout from single scroll list to tabbed groups.
- Split original "General" section into "Common" and "Display" groups.
- Split "Displayed views" tab into "Display positions" and view type toggles.
- Organize "Periodic notes" with sub-headings per granularity (Daily/Weekly/Monthly/Quarterly/Yearly).
- Move folder rule controls (pin/move/remove) to inline row with right alignment.
- Support line breaks in setting descriptions for better readability.

---

- 新增简体中文（zh-CN）本地化，覆盖设置页（100+ 条文本）、13 个命令、文件创建弹窗、导航提示等所有 UI 文本。
- 新增 i18n 框架，支持类型安全的翻译定义（`src/i18n/`），支持英文和简体中文。
- 新增设置页标签页导航（通用、显示视图、注释链接、置顶注释、属性链接、周期笔记、文件夹链接）。
- 新增文件夹规则折叠/展开与点击重命名功能。
- 新增显式 i18n tip/tooltip 字段，为设置项提供更清晰的补充说明。
- 新增插件使用说明（位于设置页顶部，附 GitHub 链接）。
- 设置页从单长列表改为分组标签页布局。
- 原"通用"区拆分为"通用"和"显示"两组。
- "显示视图"标签内拆为"显示位置"和视图类型开关。
- "周期笔记"按日记/周记/月记/季记/年记分层。
- 文件夹规则操作按钮（置顶/上移/下移/删除）同行右对齐。
- 设置描述文本支持换行显示。
