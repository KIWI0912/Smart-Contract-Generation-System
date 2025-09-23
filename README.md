# 智能合同生成系统 / Smart Contract Generation System

[EN] A modular blockchain smart contract (text) generation and management system integrating template management, hash tracking, optional Web3 interaction, PDF export, and local history.  
[中文] 一个模块化的区块链“智能合同文本”生成与管理系统，提供模板管理、哈希追踪、可选 Web3 交互、PDF 导出与本地历史记录。

---

## ✨ Features / 功能特性

- Template Management / 模板管理（official-templates.json + 动态自定义）
- Contract Assembly / 合同组装（参数填充 + 验证）
- Hash & Integrity / 哈希与完整性验证（支持多种算法）
- Web3 Integration / 区块链交互（可选：哈希上链、签名记录）
- PDF Export / PDF 导出（jspdf）
- History Persistence / 历史记录存储（浏览器存储，可扩展 IndexedDB）
- Security Layer / 安全策略（输入清洗、字段校验、未来加入 DOMPurify）
- Monitoring (Planned) / 监控（计划：性能、错误、用户行为）
- Modular CSS Layers / 模块化 CSS（base / components / utilities / tokens）
- Testing (Planned) / 测试体系（Vitest / Jest 规划中）

---

## 🏗 Project Structure / 项目结构

（最终结构建议，当前仓库可能尚未完全迁移）

```
project-root/
├── src/...
├── public/...
├── styles/...
├── docs/...
└── dist/
```

详见 docs/architecture.md（架构文档，需补充）。

---

## 🚀 Quick Start / 快速开始

### 1. Install Dependencies / 安装依赖
```
npm install
```

### 2. Development Mode / 开发模式
```
npm run dev
```
默认启用 webpack --watch，可加入 dev server.

### 3. Build / 生产构建
```
npm run build
```

### 4. Test / 运行测试
```
npm test
```
（初期 tests.js 自定义框架，迁移后使用 Vitest）

### 5. Open in Browser / 打开页面
静态部署方式：直接访问 public/index.html（若使用 webpack dev server，可 http://localhost:8080）

---

## ⚙️ Configuration / 配置说明

- CONFIG 定义在 src/core/config.js（或旧版 config.js）
- 支持多网络：Ethereum / Testnet / Custom RPC
- 环境变量（示例）：  
  - WEB3_PROVIDER_URL=...  
  - ENABLE_WEB3=true  
  - FEATURE_HASH_STRICT=true  

参考 .env.example。

---

## 📄 Templates / 模板体系

- official-templates.json：官方模板（含元数据：id、name、version、fields、jurisdiction）
- 自定义模板：后续可加入 UI 导入导出
- 模板 schema 文档：docs/template-schema.md（需补）

---

## 🔐 Security / 安全

[EN] Current security is baseline. Recommend adding DOMPurify, strict field validators, nonce usage for replay protection, and signature verification when interacting with Web3.  
[中文] 当前安全为基础级，建议：引入 DOMPurify、字段白名单验证、请求 nonce 防重放、与 Web3 交互时签名校验。

未来计划：
- XSS 过滤 / CSRF 防护（若引入后端）
- 合同文本哈希签名 + 版本追踪
- 用户操作审计（前端行为事件队列）

---

## 🧪 Testing / 测试

现状：tests.js 为自定义轻量框架。  
目标路线：
1. 引入 Vitest  
2. 拆分单元测试：src/**/*.test.js  
3. 引入覆盖率报告：npm run test -- --coverage  

---

## 🧱 Architecture Overview / 架构概览

Core Layers / 核心层次：
- Core：区块链适配 / 配置加载 / 安全工具
- Modules：合同逻辑、模板加载、历史存储
- Utils：哈希、校验、辅助函数
- UI：页面与组件
- Styles：设计 tokens + base + utilities + components

Data Flow / 数据流：
User Input → Validation → Template Merge → Hash → (Optional Web3 Write) → Persist History

---

## 🌐 Web3 Integration / 区块链交互

功能（可选启用）：
- 读取当前账户
- 计算合同哈希并写入链上（需合约支持）
- 使用签名标记合同版本

建议：
- 增加交易状态回调
- 使用 EIP-712 结构化数据签名
- 与合约 ABI 解耦：src/core/blockchain-adapter.js

---

## 📦 Build & Bundling / 构建

默认使用 webpack。可升级为 Vite（更快开发冷启动）。  
生产优化：
- 代码分包（vendor / app）
- Tree-shaking unused utils
- 压缩 CSS（PostCSS + cssnano）
- 移除 console/debug（生产模式）

---

## 🎨 Styles / 样式体系

Layers:
- base.css（重置 + 基础标签）
- utilities.css（工具类，如 flex, spacing）
- components.css（按钮、表单、对话框）
- style.css（页面特定样式）
- tokens.css（设计变量：颜色、字号、间距）

建议：
- 建立 tokens.css 并文档化
- 使用命名约定：c- 组件 / u- 工具 / is- 状态

---

## 📝 Legal Disclaimer / 法律免责声明

[EN] This system generates contract-style text templates. Generated content does NOT constitute legal advice. Always consult a qualified legal professional before executing or relying on any generated contract. The authors assume no liability for misuse or legal consequences.  
[中文] 本系统生成的是合同风格文本模板，不构成法律意见。实际使用前请咨询专业律师。作者不对任何使用或后果承担责任。

---

## 📄 License / 许可证

MIT（见 LICENSE 文件）

---

## 🙌 Contributing / 参与贡献

1. Fork & branch: feature/your-feature  
2. 提交前运行：npm run lint && npm test  
3. 发起 Pull Request 并附描述 / 截图  

---

## 🔭 Roadmap / 规划

| Phase | 内容 |
|-------|------|
| 0.1   | 基础模板生成 / 哈希 |
| 0.2   | Web3 写入 / 签名 |
| 0.3   | 模板管理 UI / 导入导出 |
| 0.4   | 国际化（中文 / 英文） |
| 0.5   | 用户权限（可选后端） |
| 0.6   | 模板市场（审核 / 评分） |

---

## 🧠 Future Enhancements / 后续增强

- AI 生成字段建议（LLM 辅助）
- 合同条款冲突检测
- 合同对比 Diff 视图
- 加入 IPFS 存证策略

---

## 📬 Contact / 联系

Email / 邮箱：ckiwi912@gmail.com  
GitHub Issues：提交问题与建议

---
感谢使用智能合同生成系统！
