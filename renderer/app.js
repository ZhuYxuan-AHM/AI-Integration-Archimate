/* app.js — UI controller with i18n (EN / ZH) */

// ── State ──────────────────────────────────────────────────────────────────
let MODEL   = null;
let CURRENT_ELEMENT = null;
let DIRTY   = false;
let LANG    = "en";   // "en" | "zh"

// ── i18n ───────────────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    // topbar / dialog
    "no-model":          "No model open",
    "dlg-cancel":        "Cancel",
    "dlg-ok":            "OK",
    "btn-new":           "+ New",
    "btn-open":          "Open",
    "btn-export":        "Export .archimate",
    "btn-compliance":    "✓ Compliance Check",
    // sidebar
    "sidebar-header":    "Model Structure",
    "btn-workflow":      "📋 Workflow Guide",
    "btn-add-element":   "+ Add Element",
    "tree-placeholder":  "Create or open a model to start.",
    "tree-no-elements":  "No elements yet.",
    // tree group labels
    "tree-motivation":   "Motivation Layer",
    "tree-business":     "Business Layer",
    "tree-application":  "Application Layer",
    "tree-constraint":   "Constraints",
    // welcome
    "welcome-title":     "AI Integration Architecture Toolkit",
    "welcome-sub":       "Model AI integration using ArchiMate 3.2 and Distributed Situation Awareness theory.\n\nStandalone — no Archi installation required. Exports valid .archimate files.",
    "btn-welcome-new":   "✨ New Model",
    "btn-welcome-open":  "📂 Open .archimate",
    // dashboard
    "dashboard-subtitle":"Model Overview",
    "btn-dash-compliance":"✓ Compliance Check",
    "btn-dash-export":   "Export .archimate",
    "card-ai-app":       "🤖 AI Application Elements",
    "card-ai-model":     "📦 AI Model Elements",
    "card-assessment":   "📊 Diagnostic Assessments",
    "card-roles":        "👥 Business Roles & Stakeholders",
    "card-constraints":  "🚧 Organizational Constraints",
    "btn-add":           "+ Add",
    "none-yet":          "None yet.",
    // stats
    "stat-total":        "Total Elements",
    "stat-ai-apps":      "AI Applications",
    "stat-ai-models":    "AI Models",
    "stat-assessments":  "Assessments",
    "stat-constraints":  "Constraints",
    // element editor
    "btn-back":          "← Back",
    "btn-delete":        "Delete",
    "tab-basic":         "📝 Basic Info",
    "basic-title":       "Basic Information",
    "label-name":        "Name",
    "label-desc":        "Description",
    "label-type":        "Element Type",
    "ready":             "✓ Ready",
    "incomplete":        "⚠ Incomplete",
    "mandatory-notice":  "★ mandatory",
    "client-warning":    "⚠ Fields below must be filled by the CLIENT, not the architect. (Independence principle)",
    // add element
    "add-el-title":      "Add Element",
    "add-el-subtitle":   "Create a new model element",
    "btn-cancel":        "← Cancel",
    "label-el-type":     "Element Type",
    "label-el-name":     "Name",
    "label-el-desc":     "Description",
    "btn-create":        "Create Element",
    "name-placeholder":  "e.g., Customer Service AI Bot",
    "desc-placeholder":  "Optional description...",
    "hint-ai-app":       "After creation, fill the 3 mandatory profiles:\nResponsibility + Model Evaluation + AI Compliance.",
    "hint-constraint":   "Fill the Boundary profile — especially the Design Space field\n(what the architect CAN do within this constraint).",
    // element type options
    "opt-ai-app":        "🤖 «AI Application» — Application Component",
    "opt-ai-model":      "📦 «AI Model» — Data Object",
    "opt-assessment":    "📊 «AI Diagnostic Assessment» — Assessment",
    "opt-role":          "👤 Business Role",
    "opt-actor":         "👥 Business Actor",
    "opt-process":       "⚙️ Business Process",
    "opt-function":      "🏢 Business Function",
    "opt-constraint":    "🚧 Constraint",
    "opt-stakeholder":   "🎯 Stakeholder",
    "opt-driver":        "🔥 Driver",
    "opt-goal":          "🏆 Goal",
    "opt-principle":     "📜 Principle",
    // compliance
    "compliance-title":  "✓ Compliance Check",
    "btn-comp-back":     "← Back",
    "btn-comp-rerun":    "Re-run",
    "no-ai-app":         "No «AI Application» elements found.",
    "add-ai-app-first":  "Add «AI Application» elements first.",
    "fully-compliant":   "✓ FULLY COMPLIANT",
    "mostly-compliant":  "⚠ MOSTLY COMPLIANT",
    "non-compliant":     "✗ NON-COMPLIANT",
    "client-action":     "🔵 CLIENT ACTION REQUIRED — client must fill this field.",
    // workflow
    "workflow-title":    "📋 Workflow Guide",
    "btn-wf-back":       "← Dashboard",
    "progress-label":    "Overall Progress",
    "step-done":         "✓ Done",
    "step-pending":      "○ Pending",
    "wf-no-model":       "Open or create a model to start tracking progress.",
    "wf-no-model-body":  "No model is open. Create or open a model first.",
    "wf-subtitle":       " steps complete — Follow these steps to build a complete AI Integration model.",
    "wf-err-title":      "No Model",
    "wf-err-body":       "Create or open a model first before opening the Workflow Guide.",
    // workflow steps
    "wf1-title":  "Create / Open Model",
    "wf1-desc":   "Start a new model or open an existing .archimate file.",
    "wf2-title":  "Add Organizational Context",
    "wf2-desc":   "Add Business Roles, Stakeholders, Business Functions, and Constraints. These represent the organizational forces that shape AI integration.",
    "wf3-title":  "Add AI Application + 3 Model Candidates",
    "wf3-desc":   "Create ≥1 «AI Application» and ≥3 «AI Model» candidates. The 3-model minimum enforces the independent evaluation principle (compliance rule C2).",
    "wf4-title":  "Fill 3 Mandatory Profiles",
    "wf4-desc":   "For every «AI Application», complete: Responsibility Profile, Model Evaluation Profile, and AI Compliance Profile.",
    "wf5-title":  "Add DSA Diagnostic Assessment",
    "wf5-desc":   "Add «AI Diagnostic Assessment» elements with SA Scores (L1 Perception, L2 Comprehension, L3 Projection) and DSA breakdown scores (vertical / horizontal / temporal).",
    "wf6-title":  "Pass Compliance Check",
    "wf6-desc":   "All 5 rules must pass: C1 Responsibility complete, C2 ≥3 candidate models, C3 Client selected model, C4 Date order valid, C5 Compliance officer named.",
    "wf7-title":  "Export .archimate File",
    "wf7-desc":   "Export as a valid .archimate file. Open in Archi tool for professional visualization and viewpoint diagrams.",
    // workflow action buttons
    "act-new-model":   "New Model",
    "act-add-element": "Add Element",
    "act-add-ai-app":  "Add AI Application",
    "act-edit-ai-app": "Edit AI App",
    "act-add-assess":  "Add Assessment",
    "act-compliance":  "Run Compliance Check",
    "act-export":      "Export .archimate",
    // workflow hints
    "wf1-hint-open":      "Open: \"",
    "wf1-hint-none":      "No model is open yet.",
    "wf2-hint":           " org element(s). Recommended: ≥2 (roles, functions, constraints, stakeholders).",
    "wf3-hint-1":         " AI App(s), ",
    "wf3-hint-2":         " AI Model(s). Need: ≥1 app + ≥3 models.",
    "wf4-hint-none":      "Add an AI Application first (Step 3).",
    "wf4-hint-ok":        "All mandatory profiles complete on all AI Apps. ✓",
    "wf4-hint-fail":      "Check element cards for ⚠ Incomplete badges.",
    "wf5-hint":           " assessment(s). Need ≥1 with SA or DSA scores filled.",
    "wf6-hint-need-app":  "Add an AI Application first.",
    "wf6-hint-ok":        "All 5 checks pass. ✓",
    "wf6-hint-fail":      "Run the check to see which rules are failing.",
    "wf7-hint-none":      "Create a model first.",
    "wf7-hint-ok":        "Model is exported and up to date. ✓",
    "wf7-hint-dirty":     "Model has unsaved changes — export to finalize.",
    // diagram
    "btn-diagram":        "🗺 Diagram",
    "diagram-title":      "Architecture Diagram",
    "diagram-subtitle":   "ArchiMate 3.2 layered view — auto-generated from model elements",
    "btn-export-svg":     "↓ SVG",
    "btn-export-png":     "↓ Export PNG",
    "legend-app":         "● green/red dot = profiles complete/incomplete",
    "legend-model":       "Purple border = client-selected model",
    "legend-eval":        "SA score shown on assessments",
    "no-elements-diag":   "No elements to display. Add elements from the Dashboard first.",
    // dialogs
    "new-model-prompt":   "Model name:",
    "delete-title":       "Delete Element",
    "delete-msg":         "? This cannot be undone.",
    "export-ok-title":    "Exported",
    "export-ok-body":     "\n\nOpen in Archi tool for visualization.",
    "no-model-err":       "Create or open a model first.",
    "name-required-title":"Name Required",
    "name-required":      "Please enter a name for the element.",
    "parse-err":          "Could not parse .archimate file:\n",
    "about-title":        "About",
    "about-body":         "AI Integration Architecture Toolkit v1.0\n\nDSR paper design artifact for:\n\"Distributed Situation Awareness Breakdown:\nWhy AI Agents Fail in Established Organizations\"\n\nBuilt with Electron 39 + ArchiMate 3.2\nEndsley (1995) SA theory · Stanton et al. (2006) DSA theory",
  },
  zh: {
    // topbar / dialog
    "no-model":          "未打开模型",
    "dlg-cancel":        "取消",
    "dlg-ok":            "确定",
    "btn-new":           "+ 新建",
    "btn-open":          "打开",
    "btn-export":        "导出 .archimate",
    "btn-compliance":    "✓ 合规检查",
    // sidebar
    "sidebar-header":    "模型结构",
    "btn-workflow":      "📋 工作流引导",
    "btn-add-element":   "+ 添加元素",
    "tree-placeholder":  "新建或打开模型开始建模。",
    "tree-no-elements":  "暂无元素。",
    // tree group labels
    "tree-motivation":   "动机层",
    "tree-business":     "业务层",
    "tree-application":  "应用层",
    "tree-constraint":   "约束",
    // welcome
    "welcome-title":     "AI集成架构工具包",
    "welcome-sub":       "基于ArchiMate 3.2和分布式态势感知理论的AI集成架构建模工具。\n\n独立运行，无需安装Archi工具。可导出标准 .archimate 文件。",
    "btn-welcome-new":   "✨ 新建模型",
    "btn-welcome-open":  "📂 打开文件",
    // dashboard
    "dashboard-subtitle":"模型概览",
    "btn-dash-compliance":"✓ 合规检查",
    "btn-dash-export":   "导出 .archimate",
    "card-ai-app":       "🤖 AI应用元素",
    "card-ai-model":     "📦 AI模型元素",
    "card-assessment":   "📊 诊断评估",
    "card-roles":        "👥 业务角色与利益相关方",
    "card-constraints":  "🚧 组织约束",
    "btn-add":           "+ 添加",
    "none-yet":          "暂无。",
    // stats
    "stat-total":        "总元素数",
    "stat-ai-apps":      "AI应用",
    "stat-ai-models":    "AI模型",
    "stat-assessments":  "评估",
    "stat-constraints":  "约束",
    // element editor
    "btn-back":          "← 返回",
    "btn-delete":        "删除",
    "tab-basic":         "📝 基本信息",
    "basic-title":       "基本信息",
    "label-name":        "名称",
    "label-desc":        "描述",
    "label-type":        "元素类型",
    "ready":             "✓ 已完成",
    "incomplete":        "⚠ 未完成",
    "mandatory-notice":  "★ 必填",
    "client-warning":    "⚠ 以下字段必须由客户方填写，而非架构师（独立性原则）",
    // add element
    "add-el-title":      "添加元素",
    "add-el-subtitle":   "创建新的模型元素",
    "btn-cancel":        "← 取消",
    "label-el-type":     "元素类型",
    "label-el-name":     "名称",
    "label-el-desc":     "描述",
    "btn-create":        "创建元素",
    "name-placeholder":  "例如：客服AI机器人",
    "desc-placeholder":  "可选描述...",
    "hint-ai-app":       "创建后，请填写3个必填配置文件：\n职责配置 + 模型评估配置 + 合规配置。",
    "hint-constraint":   "填写边界配置文件，特别是「设计空间」字段\n（架构师在此约束内能做什么）。",
    // element type options
    "opt-ai-app":        "🤖 «AI应用» — 应用组件",
    "opt-ai-model":      "📦 «AI模型» — 数据对象",
    "opt-assessment":    "📊 «AI诊断评估» — 评估",
    "opt-role":          "👤 业务角色",
    "opt-actor":         "👥 业务参与者",
    "opt-process":       "⚙️ 业务流程",
    "opt-function":      "🏢 业务职能（部门）",
    "opt-constraint":    "🚧 约束",
    "opt-stakeholder":   "🎯 利益相关方",
    "opt-driver":        "🔥 驱动力",
    "opt-goal":          "🏆 目标",
    "opt-principle":     "📜 原则",
    // compliance
    "compliance-title":  "✓ 合规检查",
    "btn-comp-back":     "← 返回",
    "btn-comp-rerun":    "重新运行",
    "no-ai-app":         "未找到«AI应用»元素。",
    "add-ai-app-first":  "请先添加«AI应用»元素。",
    "fully-compliant":   "✓ 完全合规",
    "mostly-compliant":  "⚠ 基本合规",
    "non-compliant":     "✗ 不合规",
    "client-action":     "🔵 需要客户方操作 — 此字段必须由客户方填写。",
    // workflow
    "workflow-title":    "📋 工作流引导",
    "btn-wf-back":       "← 返回仪表板",
    "progress-label":    "总进度",
    "step-done":         "✓ 完成",
    "step-pending":      "○ 待完成",
    "wf-no-model":       "打开或创建模型以开始跟踪进度。",
    "wf-no-model-body":  "未打开模型，请先新建或打开模型。",
    "wf-subtitle":       " 个步骤已完成 — 按以下步骤构建完整AI集成模型。",
    "wf-err-title":      "无模型",
    "wf-err-body":       "请先新建或打开模型，再打开工作流引导。",
    // workflow steps
    "wf1-title":  "新建或打开模型",
    "wf1-desc":   "新建模型或打开现有 .archimate 文件。",
    "wf2-title":  "添加组织背景",
    "wf2-desc":   "添加业务角色、利益相关方、业务职能和约束，代表影响AI集成的组织力量。",
    "wf3-title":  "添加AI应用与三个候选模型",
    "wf3-desc":   "创建至少1个«AI应用»和至少3个«AI模型»候选方案。3个候选模型的最低要求确保独立评估原则（合规规则C2）。",
    "wf4-title":  "填写3个必填配置文件",
    "wf4-desc":   "为每个«AI应用»完成：职责配置、模型评估配置和AI合规配置。",
    "wf5-title":  "添加DSA诊断评估",
    "wf5-desc":   "添加包含SA评分（L1感知、L2理解、L3投射）和DSA分解评分（垂直/水平/时间）的«AI诊断评估»元素。",
    "wf6-title":  "通过合规检查",
    "wf6-desc":   "5项规则必须全部通过：C1职责完整、C2≥3候选模型、C3客户选定模型、C4日期顺序正确、C5合规负责人已命名。",
    "wf7-title":  "导出 .archimate 文件",
    "wf7-desc":   "导出为有效的 .archimate 文件，可在Archi工具中进行专业可视化和视图制作。",
    // workflow action buttons
    "act-new-model":   "新建模型",
    "act-add-element": "添加元素",
    "act-add-ai-app":  "添加AI应用",
    "act-edit-ai-app": "编辑AI应用",
    "act-add-assess":  "添加评估",
    "act-compliance":  "运行合规检查",
    "act-export":      "导出 .archimate",
    // workflow hints
    "wf1-hint-open":      "已打开：\"",
    "wf1-hint-none":      "尚未打开模型。",
    "wf2-hint":           " 个组织元素。建议：≥2个（角色、职能、约束、利益相关方）。",
    "wf3-hint-1":         " 个AI应用，",
    "wf3-hint-2":         " 个AI模型。需要：≥1个应用 + ≥3个模型。",
    "wf4-hint-none":      "请先添加AI应用（步骤3）。",
    "wf4-hint-ok":        "所有AI应用的必填配置文件均已完成。✓",
    "wf4-hint-fail":      "查看元素卡片上的⚠未完成标志。",
    "wf5-hint":           " 个评估。需要≥1个已填写SA或DSA评分的评估。",
    "wf6-hint-need-app":  "请先添加AI应用。",
    "wf6-hint-ok":        "所有5项检查均通过。✓",
    "wf6-hint-fail":      "运行检查以查看哪些规则未通过。",
    "wf7-hint-none":      "请先创建模型。",
    "wf7-hint-ok":        "模型已导出且为最新状态。✓",
    "wf7-hint-dirty":     "模型有未保存的更改 — 导出以完成。",
    // diagram
    "btn-diagram":        "🗺 架构图",
    "diagram-title":      "架构图",
    "diagram-subtitle":   "ArchiMate 3.2 分层视图 — 根据模型元素自动生成",
    "btn-export-svg":     "↓ SVG",
    "btn-export-png":     "↓ 导出 PNG",
    "legend-app":         "● 绿/红圆点 = 配置文件完成/未完成",
    "legend-model":       "紫色边框 = 客户已选定模型",
    "legend-eval":        "评估元素显示SA评分",
    "no-elements-diag":   "暂无元素可显示，请先在仪表板添加元素。",
    // dialogs
    "new-model-prompt":   "模型名称：",
    "delete-title":       "删除元素",
    "delete-msg":         "？此操作不可撤销。",
    "export-ok-title":    "导出成功",
    "export-ok-body":     "\n\n可在Archi工具中打开查看可视化模型。",
    "no-model-err":       "请先新建或打开模型。",
    "name-required-title":"名称必填",
    "name-required":      "请填写元素名称。",
    "parse-err":          "无法解析 .archimate 文件：\n",
    "about-title":        "关于",
    "about-body":         "AI集成架构工具包 v1.0\n\nDSR论文设计工件：\n《分布式态势感知断裂：为何AI在成熟组织中失败》\n\n基于 Electron 39 + ArchiMate 3.2\nEndsley (1995) SA理论 · Stanton 等 (2006) DSA理论",
  }
};

function t(key) {
  return STRINGS[LANG]?.[key] ?? STRINGS["en"]?.[key] ?? key;
}

function applyLang() {
  // Update lang toggle button label
  const btnLang = document.getElementById("btn-lang");
  if (btnLang) btnLang.textContent = LANG === "en" ? "中文" : "EN";
  document.documentElement.lang = LANG;

  // Update all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    // Don't overwrite topbar-model-name if a model is open
    if (el.id === "topbar-model-name" && MODEL) return;
    el.textContent = t(key);
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Update <option> elements
  document.querySelectorAll("[data-i18n-opt]").forEach(el => {
    el.textContent = t(el.dataset.i18nOpt);
  });

  // Re-render dynamic content if model is open
  if (MODEL) {
    setDirty(DIRTY); // refresh topbar model name
    renderSidebar();
    // Re-render whichever page is currently visible
    const pages = ["page-dashboard","page-element","page-add-element","page-compliance","page-workflow"];
    const visible = pages.find(p => !document.getElementById(p).classList.contains("hidden"));
    if (visible === "page-dashboard")   renderDashboard();
    if (visible === "page-element" && CURRENT_ELEMENT) renderProfileEditor(getEl(CURRENT_ELEMENT));
    if (visible === "page-compliance")  renderComplianceResults();
    if (visible === "page-diagram")     renderDiagram();
    if (visible === "page-workflow")    renderWorkflow();
  }
}

// ── Utilities ──────────────────────────────────────────────────────────────
function uid() {
  return "el-" + Math.random().toString(36).slice(2, 10);
}
function getEl(id) {
  return (MODEL?.elements || []).find(e => e.id === id) || null;
}
function setDirty(val = true) {
  DIRTY = val;
  const name = MODEL?.name || "";
  document.getElementById("topbar-model-name").textContent = name
    ? name + (val ? " •" : "")
    : t("no-model");
}
function showPage(id) {
  ["welcome","page-dashboard","page-element","page-add-element","page-compliance","page-diagram","page-workflow"]
    .forEach(p => document.getElementById(p).classList.toggle("hidden", p !== id));
}
function esc(str) {
  return (str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Custom input dialog ────────────────────────────────────────────────────
function showInputDialog(title, defaultValue) {
  return new Promise(resolve => {
    const dlg   = document.getElementById("input-dialog");
    const inp   = document.getElementById("input-dialog-value");
    const btnOk = document.getElementById("input-dialog-ok");
    const btnCn = document.getElementById("input-dialog-cancel");

    document.getElementById("input-dialog-title").textContent = title;
    inp.value = defaultValue || "";
    dlg.showModal();
    inp.focus();
    inp.select();

    const done = val => {
      dlg.close();
      btnOk.onclick = null;
      btnCn.onclick = null;
      inp.onkeydown = null;
      resolve(val);
    };
    btnOk.onclick  = () => done(inp.value.trim() || null);
    btnCn.onclick  = () => done(null);
    inp.onkeydown  = e => {
      if (e.key === "Enter")  { e.preventDefault(); btnOk.click(); }
      if (e.key === "Escape") { e.preventDefault(); btnCn.click(); }
    };
  });
}

// ── Element type metadata ──────────────────────────────────────────────────
const EL_META = {
  "ai-app":     { labelKey: "opt-ai-app",        icon: "🤖" },
  "ai-model":   { labelKey: "opt-ai-model",       icon: "📦" },
  "assessment": { labelKey: "opt-assessment",     icon: "📊" },
  "role":       { labelKey: "opt-role",           icon: "👤" },
  "actor":      { labelKey: "opt-actor",          icon: "👥" },
  "process":    { labelKey: "opt-process",        icon: "⚙️" },
  "function":   { labelKey: "opt-function",       icon: "🏢" },
  "constraint": { labelKey: "opt-constraint",     icon: "🚧" },
  "stakeholder":{ labelKey: "opt-stakeholder",    icon: "🎯" },
  "driver":     { labelKey: "opt-driver",         icon: "🔥" },
  "goal":       { labelKey: "opt-goal",           icon: "🏆" },
  "principle":  { labelKey: "opt-principle",      icon: "📜" },
};
function elLabel(type) {
  const m = EL_META[type];
  return m ? t(m.labelKey) : type;
}

// ── Core actions ───────────────────────────────────────────────────────────
async function newModel() {
  const name = await showInputDialog(t("new-model-prompt"), "My AI Integration Model");
  if (!name) return;
  MODEL = { name, description: "", elements: [], relationships: [] };
  CURRENT_ELEMENT = null;
  setDirty(false);
  document.getElementById("btn-add-element").disabled = false;
  showDashboard();
  renderSidebar();
}

async function openFile() {
  await window.electronAPI.openFile();
}

function showDashboard() {
  if (!MODEL) { showPage("welcome"); return; }
  CURRENT_ELEMENT = null;
  showPage("page-dashboard");
  document.getElementById("dashboard-title").textContent = MODEL.name;
  renderDashboard();
  renderSidebar();
}

async function exportModel() {
  if (!MODEL) { await window.electronAPI.showError("No Model", t("no-model-err")); return; }
  const xml      = ArchiMateGenerator.generate(MODEL);
  const safeName = (MODEL.name || "model").replace(/[^a-z0-9_-]/gi, "_") + ".archimate";
  const result   = await window.electronAPI.saveFile({ content: xml, defaultName: safeName });
  if (result?.success) {
    await window.electronAPI.showInfo(
      t("export-ok-title"),
      (LANG === "zh" ? "模型已导出至：\n" : "Model exported to:\n") + result.path + t("export-ok-body")
    );
    setDirty(false);
  }
}

function runComplianceCheck() {
  if (!MODEL) { window.electronAPI.showError("No Model", t("no-model-err")); return; }
  showPage("page-compliance");
  renderComplianceResults();
}

function showAddElement(presetType) {
  if (!MODEL) return;
  showPage("page-add-element");
  if (presetType) {
    document.getElementById("new-el-type").value = presetType;
    updateAddHint();
  }
}

function updateAddHint() {
  const type = document.getElementById("new-el-type").value;
  const hint = document.getElementById("new-el-hint");
  const map  = { "ai-app": "hint-ai-app", "constraint": "hint-constraint" };
  if (map[type]) { hint.textContent = t(map[type]); hint.classList.remove("hidden"); }
  else           { hint.classList.add("hidden"); }
}

async function createNewElement() {
  if (!MODEL) return;
  const type = document.getElementById("new-el-type").value;
  const name = document.getElementById("new-el-name").value.trim();
  const desc = document.getElementById("new-el-desc").value.trim();
  if (!name) {
    await window.electronAPI.showError(t("name-required-title"), t("name-required"));
    return;
  }
  const el = { id: uid(), type, name, description: desc, props: {} };
  MODEL.elements.push(el);
  setDirty();
  document.getElementById("new-el-name").value = "";
  document.getElementById("new-el-desc").value = "";
  editElement(el.id);
}

async function deleteCurrentElement() {
  if (!CURRENT_ELEMENT || !MODEL) return;
  const el = getEl(CURRENT_ELEMENT);
  if (!el) return;
  const ok = await window.electronAPI.showConfirm(
    t("delete-title"),
    (LANG === "zh" ? "删除\"" : "Delete \"") + el.name + "\"" + t("delete-msg")
  );
  if (!ok) return;
  MODEL.elements    = MODEL.elements.filter(e => e.id !== CURRENT_ELEMENT);
  MODEL.relationships = (MODEL.relationships || []).filter(r => r.source !== CURRENT_ELEMENT && r.target !== CURRENT_ELEMENT);
  CURRENT_ELEMENT = null;
  setDirty();
  showDashboard();
}

// ── Render: dashboard ──────────────────────────────────────────────────────
function renderDashboard() {
  if (!MODEL) return;
  const els    = MODEL.elements || [];
  const counts = {};
  for (const e of els) counts[e.type] = (counts[e.type] || 0) + 1;

  document.getElementById("stats-row").innerHTML = `
    <div class="stat-box"><div class="stat-num">${els.length}</div><div class="stat-label">${t("stat-total")}</div></div>
    <div class="stat-box"><div class="stat-num">${counts["ai-app"]||0}</div><div class="stat-label">${t("stat-ai-apps")}</div></div>
    <div class="stat-box"><div class="stat-num">${counts["ai-model"]||0}</div><div class="stat-label">${t("stat-ai-models")}</div></div>
    <div class="stat-box"><div class="stat-num">${counts["assessment"]||0}</div><div class="stat-label">${t("stat-assessments")}</div></div>
    <div class="stat-box"><div class="stat-num">${counts["constraint"]||0}</div><div class="stat-label">${t("stat-constraints")}</div></div>`;

  renderList("ai-app-list",    els.filter(e => e.type === "ai-app"));
  renderList("ai-model-list",  els.filter(e => e.type === "ai-model"));
  renderList("assessment-list",els.filter(e => e.type === "assessment"));
  renderList("role-list",      els.filter(e => ["role","actor","process","function","stakeholder","driver","goal","principle"].includes(e.type)));
  renderList("constraint-list",els.filter(e => e.type === "constraint"));
}

function renderList(containerId, elements) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (elements.length === 0) {
    container.innerHTML = `<div class="text-muted" style="font-size:13px;">${t("none-yet")}</div>`;
    return;
  }
  container.innerHTML = elements.map(el => {
    const meta             = EL_META[el.type] || { icon: "⬜" };
    const profiles         = PROFILES_FOR_TYPE[el.type] || [];
    const mandatoryProfiles= profiles.filter(pid => PROFILES[pid]?.mandatory);
    const allMandatoryFilled = mandatoryProfiles.every(pid => {
      const schema = PROFILES[pid];
      return schema && schema.sections.some(s => s.fields.some(f => el.props?.[f.key]?.trim()));
    });
    const compliance = mandatoryProfiles.length > 0
      ? `<span class="status ${allMandatoryFilled ? "status-pass" : "status-fail"}">${allMandatoryFilled ? t("ready") : t("incomplete")}</span>`
      : "";
    const filledBadges = profiles.map(pid => {
      const schema  = PROFILES[pid];
      const hasData = schema && schema.sections.some(s => s.fields.some(f => el.props?.[f.key]?.trim()));
      const lbl     = LANG === "zh" ? schema?.label_zh : schema?.label_en;
      return `<span class="status ${hasData ? "status-pass" : "status-warn"}">${lbl || pid}</span>`;
    }).join("");
    return `<div class="element-card" data-id="${esc(el.id)}">
      <div class="element-type-icon">${meta.icon}</div>
      <div class="element-info">
        <div class="element-name">${esc(el.name)}</div>
        <div class="element-type">${esc(elLabel(el.type))}</div>
        <div class="element-badges mt-8">${filledBadges} ${compliance}</div>
      </div>
    </div>`;
  }).join("");

  container.querySelectorAll(".element-card").forEach(card => {
    card.addEventListener("click", () => editElement(card.dataset.id));
  });
}

function renderSidebar() {
  if (!MODEL) return;
  const tree   = document.getElementById("sidebar-tree");
  const groups = [
    { key: "tree-motivation", types: ["stakeholder","driver","goal","principle","assessment"] },
    { key: "tree-business",   types: ["function","role","actor","process"] },
    { key: "tree-application",types: ["ai-app","ai-model"] },
    { key: "tree-constraint", types: ["constraint"] },
  ];

  let html = "";
  for (const g of groups) {
    const els = (MODEL.elements || []).filter(e => g.types.includes(e.type));
    if (!els.length) continue;
    html += `<div class="tree-section">${esc(t(g.key))}</div>`;
    for (const el of els) {
      const meta   = EL_META[el.type] || { icon: "⬜" };
      const active = el.id === CURRENT_ELEMENT ? "active" : "";
      html += `<div class="tree-item ${active}" data-id="${esc(el.id)}">
        <span class="tree-icon">${meta.icon}</span>
        <span>${esc(el.name)}</span>
      </div>`;
    }
  }
  if (!html) html = `<div class="text-muted" style="padding:14px;font-size:12px;">${t("tree-no-elements")}</div>`;
  tree.innerHTML = html;

  tree.querySelectorAll(".tree-item").forEach(item => {
    item.addEventListener("click", () => editElement(item.dataset.id));
  });
}

// ── Element editor ─────────────────────────────────────────────────────────
function editElement(id) {
  const el = getEl(id);
  if (!el) return;
  CURRENT_ELEMENT = id;
  showPage("page-element");
  const meta = EL_META[el.type] || { icon: "⬜" };
  document.getElementById("el-title").textContent    = meta.icon + "  " + el.name;
  document.getElementById("el-subtitle").textContent = elLabel(el.type);
  renderProfileEditor(el);
  renderSidebar();
}

function renderProfileEditor(el) {
  const profiles  = PROFILES_FOR_TYPE[el.type] || [];
  const tabsEl    = document.getElementById("profile-tabs");
  const panelsEl  = document.getElementById("profile-panels");

  let tabsHTML   = `<div class="tab active" data-tab="basic">${t("tab-basic")}</div>`;
  let panelsHTML = `<div class="tab-panel active" id="panel-basic">${buildBasicForm(el)}</div>`;

  for (const pid of profiles) {
    const schema = PROFILES[pid];
    if (!schema) continue;
    const hasData    = schema.sections.some(s => s.fields.some(f => el.props?.[f.key]?.trim()));
    const complClass = hasData ? " complete" : "";
    const lbl        = LANG === "zh" ? schema.label_zh : schema.label_en;
    tabsHTML   += `<div class="tab${complClass}" data-tab="${esc(pid)}">${esc(lbl)}${schema.mandatory ? '<span class="required">*</span>' : ""}</div>`;
    panelsHTML += `<div class="tab-panel" id="panel-${esc(pid)}">${buildProfileForm(el, schema)}</div>`;
  }

  tabsEl.innerHTML   = tabsHTML;
  panelsEl.innerHTML = panelsHTML;

  tabsEl.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  panelsEl.querySelectorAll("[data-prop-key]").forEach(input => {
    const key   = input.dataset.propKey;
    const elId  = input.dataset.propEl;
    const event = (input.tagName === "SELECT" || input.type === "date") ? "change" : "input";
    input.addEventListener(event, () => {
      const target = getEl(elId);
      if (!target) return;
      if (!target.props) target.props = {};
      target.props[key] = input.value;
      if (key === "name") {
        target.name = input.value;
        document.getElementById("el-title").textContent = (EL_META[target.type]?.icon || "") + "  " + input.value;
        renderSidebar();
      }
      setDirty();
    });
  });
}

function buildBasicForm(el) {
  return `<div class="card">
    <div class="card-title" style="margin-bottom:16px;">${t("basic-title")}</div>
    <div class="form-group">
      <label class="form-label">${t("label-name")} <span class="required">*</span></label>
      <input class="form-control" type="text" value="${esc(el.name)}" data-prop-key="name" data-prop-el="${esc(el.id)}"/>
    </div>
    <div class="form-group">
      <label class="form-label">${t("label-desc")}</label>
      <textarea class="form-control" rows="4" data-prop-key="description" data-prop-el="${esc(el.id)}">${esc(el.description || "")}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">${t("label-type")}</label>
      <input class="form-control" type="text" value="${esc(elLabel(el.type))}" disabled/>
    </div>
  </div>`;
}

function buildProfileForm(el, schema) {
  const desc = LANG === "zh" ? schema.desc_zh : schema.desc_en;
  let html = `<div class="card">`;
  if (schema.mandatory) {
    html += `<div class="warning-box" style="margin-bottom:16px;">${t("mandatory-notice")}: ${esc(desc)}</div>`;
  }
  for (const section of schema.sections) {
    const sectionTitle = LANG === "zh" ? section.title_zh : section.title_en;
    html += `<div class="form-section-title">${esc(sectionTitle)}</div>`;
    if (sectionTitle.includes("CLIENT") || sectionTitle.includes("客户方")) {
      html += `<div class="warning-box">${t("client-warning")}</div>`;
    }
    html += `<div class="form-grid">`;
    for (const field of section.fields) {
      const val   = (el.props?.[field.key]) || "";
      const label = LANG === "zh" ? field.cn : field.en;
      html += `<div class="form-group">
        <label class="form-label">${esc(label)}${field.required ? '<span class="required"> *</span>' : ""}</label>`;

      if (field.type === "textarea") {
        html += `<textarea class="form-control" rows="3" data-prop-key="${esc(field.key)}" data-prop-el="${esc(el.id)}">${esc(val)}</textarea>`;
      } else if (field.type === "select") {
        html += `<select class="form-control" data-prop-key="${esc(field.key)}" data-prop-el="${esc(el.id)}">`;
        for (const opt of (field.options || [])) {
          html += `<option value="${esc(opt)}"${val === opt ? " selected" : ""}>${esc(opt)}</option>`;
        }
        html += `</select>`;
      } else if (field.type === "date") {
        html += `<input class="form-control" type="date" value="${esc(val)}" data-prop-key="${esc(field.key)}" data-prop-el="${esc(el.id)}"/>`;
      } else {
        html += `<input class="form-control" type="text" value="${esc(val)}" data-prop-key="${esc(field.key)}" data-prop-el="${esc(el.id)}"/>`;
      }

      if (field.hint) html += `<div class="form-hint">${esc(field.hint)}</div>`;
      html += `</div>`;
    }
    html += `</div>`;
  }
  return html + `</div>`;
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tabId));
}

// ── Compliance check ───────────────────────────────────────────────────────
function renderComplianceResults() {
  const results   = ComplianceChecker.run(MODEL);
  const subtitle  = document.getElementById("compliance-subtitle");
  const container = document.getElementById("compliance-results");

  if (results.noElements) {
    subtitle.textContent = t("no-ai-app");
    container.innerHTML  = `<div class="card"><p class="text-muted">${t("add-ai-app-first")}</p></div>`;
    return;
  }

  const pct         = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
  const statusClass = pct === 100 ? "status-pass" : pct >= 80 ? "status-warn" : "status-fail";
  const statusLabel = pct === 100 ? t("fully-compliant") : pct >= 80 ? t("mostly-compliant") : t("non-compliant");
  subtitle.innerHTML = `${results.passed} / ${results.total} &nbsp;<span class="status ${statusClass}">${statusLabel}</span>`;

  const byElement = {};
  for (const c of results.checks) {
    if (!byElement[c.element]) byElement[c.element] = [];
    byElement[c.element].push(c);
  }

  let html = "";
  for (const [elName, checks] of Object.entries(byElement)) {
    const elPassed = checks.filter(c => c.pass).length;
    html += `<div class="card">
      <div class="card-header">
        <div class="card-title">🤖 ${esc(elName)}</div>
        <span class="status ${elPassed === checks.length ? "status-pass" : "status-fail"}">${elPassed}/${checks.length}</span>
      </div>`;
    for (const c of checks) {
      html += `<div class="check-row">
        <div class="check-icon">${c.pass ? "✅" : c.clientAction ? "🔵" : "❌"}</div>
        <div style="flex:1">
          <div class="check-label">${esc(c.id)} — ${esc(c.label)}</div>
          <div class="check-detail">${esc(c.detail)}</div>
          ${c.action ? `<div class="check-element">→ ${esc(c.action)}</div>` : ""}
          ${c.clientAction ? `<div class="check-element" style="color:var(--accent2)">${t("client-action")}</div>` : ""}
        </div>
      </div>`;
    }
    html += `</div>`;
  }
  container.innerHTML = html;
}

// ── Workflow Guide ─────────────────────────────────────────────────────────
function getWorkflowSteps() {
  const els         = MODEL?.elements || [];
  const aiApps      = els.filter(e => e.type === "ai-app");
  const aiModels    = els.filter(e => e.type === "ai-model");
  const assessments = els.filter(e => e.type === "assessment");
  const orgElements = els.filter(e =>
    ["role","actor","function","stakeholder","driver","goal","constraint"].includes(e.type));

  const hasEnoughModels = aiApps.length >= 1 && aiModels.length >= 3;

  const mandatoryIds = ["responsibility", "model_evaluation", "compliance"];
  const allProfilesFilled = aiApps.length > 0 && aiApps.every(app =>
    mandatoryIds.every(pid => {
      const schema = PROFILES[pid];
      return schema && schema.sections.some(s => s.fields.some(f => app.props?.[f.key]?.trim()));
    })
  );

  const hasScores = assessments.some(a =>
    a.props?.pa_score || a.props?.vertical_sharing_score);

  let compliancePassed = false;
  if (MODEL && aiApps.length > 0) {
    const r = ComplianceChecker.run(MODEL);
    compliancePassed = !r.noElements && r.total > 0 && r.passed === r.total;
  }

  const exported = !!MODEL && !DIRTY;

  return [
    {
      n: 1, done: !!MODEL,
      title: t("wf1-title"), desc: t("wf1-desc"),
      action: MODEL ? null : { label: t("act-new-model"), fn: newModel },
      hint: MODEL ? t("wf1-hint-open") + MODEL.name + '"' : t("wf1-hint-none"),
    },
    {
      n: 2, done: orgElements.length >= 2,
      title: t("wf2-title"), desc: t("wf2-desc"),
      action: { label: t("act-add-element"), fn: () => showAddElement("role") },
      hint: orgElements.length + t("wf2-hint"),
    },
    {
      n: 3, done: hasEnoughModels,
      title: t("wf3-title"), desc: t("wf3-desc"),
      action: { label: t("act-add-ai-app"), fn: () => showAddElement("ai-app") },
      hint: aiApps.length + t("wf3-hint-1") + aiModels.length + t("wf3-hint-2"),
    },
    {
      n: 4, done: allProfilesFilled,
      title: t("wf4-title"), desc: t("wf4-desc"),
      action: aiApps.length > 0
        ? { label: t("act-edit-ai-app"), fn: () => editElement(aiApps[0].id) }
        : { label: t("act-add-ai-app"),  fn: () => showAddElement("ai-app") },
      hint: aiApps.length === 0 ? t("wf4-hint-none")
          : allProfilesFilled   ? t("wf4-hint-ok")
          : t("wf4-hint-fail"),
    },
    {
      n: 5, done: hasScores,
      title: t("wf5-title"), desc: t("wf5-desc"),
      action: { label: t("act-add-assess"), fn: () => showAddElement("assessment") },
      hint: assessments.length + t("wf5-hint"),
    },
    {
      n: 6, done: compliancePassed,
      title: t("wf6-title"), desc: t("wf6-desc"),
      action: { label: t("act-compliance"), fn: runComplianceCheck },
      hint: !MODEL || aiApps.length === 0 ? t("wf6-hint-need-app")
          : compliancePassed ? t("wf6-hint-ok")
          : t("wf6-hint-fail"),
    },
    {
      n: 7, done: exported,
      title: t("wf7-title"), desc: t("wf7-desc"),
      action: { label: t("act-export"), fn: exportModel },
      hint: !MODEL ? t("wf7-hint-none") : exported ? t("wf7-hint-ok") : t("wf7-hint-dirty"),
    },
  ];
}

function renderWorkflow() {
  const container = document.getElementById("workflow-steps");
  const subtitle  = document.getElementById("workflow-subtitle");

  if (!MODEL) {
    subtitle.textContent = t("wf-no-model");
    container.innerHTML  = `<div class="card"><p class="text-muted">${t("wf-no-model-body")}</p></div>`;
    return;
  }

  const steps     = getWorkflowSteps();
  const doneCount = steps.filter(s => s.done).length;
  subtitle.textContent = doneCount + " / " + steps.length + t("wf-subtitle");

  const pct = Math.round((doneCount / steps.length) * 100);
  let html = `<div class="card" style="margin-bottom:20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:600;">${t("progress-label")}</div>
      <div style="font-size:13px;color:var(--accent);font-weight:700;">${pct}%</div>
    </div>
    <div style="background:var(--bg3);border-radius:4px;height:8px;overflow:hidden;">
      <div style="background:var(--accent);height:100%;width:${pct}%;transition:width 0.3s;border-radius:4px;"></div>
    </div>
  </div>`;

  for (const step of steps) {
    html += `<div class="workflow-step${step.done ? " done" : ""}">
      <div class="workflow-step-header">
        <div class="workflow-step-num${step.done ? " done" : ""}">${step.n}</div>
        <div style="flex:1;min-width:0;">
          <div class="workflow-step-title">${esc(step.title)}</div>
          <div class="workflow-step-desc">${esc(step.desc)}</div>
          ${step.hint ? `<div class="form-hint" style="margin-top:5px;">${esc(step.hint)}</div>` : ""}
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
          <span class="status ${step.done ? "status-pass" : "status-warn"}">${step.done ? t("step-done") : t("step-pending")}</span>
          ${step.action ? `<button class="btn btn-sm btn-primary workflow-action-btn" data-step="${step.n}">→ ${esc(step.action.label)}</button>` : ""}
        </div>
      </div>
    </div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll(".workflow-action-btn").forEach(btn => {
    const step = steps[parseInt(btn.dataset.step) - 1];
    if (step?.action?.fn) {
      btn.addEventListener("click", () => {
        showPage("page-dashboard");
        step.action.fn();
      });
    }
  });
}

function showWorkflow() {
  if (!MODEL) {
    window.electronAPI.showError(t("wf-err-title"), t("wf-err-body"));
    return;
  }
  showPage("page-workflow");
  renderWorkflow();
}

// ── Architecture Diagram ───────────────────────────────────────────────────
function showDiagram() {
  if (!MODEL) { window.electronAPI.showError("No Model", t("no-model-err")); return; }
  showPage("page-diagram");
  renderDiagram();
}

function renderDiagram() {
  const container = document.getElementById("diagram-container");
  const legend    = document.getElementById("diagram-legend");
  if (!MODEL || !(MODEL.elements || []).length) {
    container.innerHTML = `<div class="card"><p class="text-muted">${t("no-elements-diag")}</p></div>`;
    if (legend) legend.innerHTML = "";
    return;
  }
  const svgStr = DiagramRenderer.renderSVG(MODEL, LANG);
  container.innerHTML = svgStr;

  // Legend
  if (legend) {
    legend.innerHTML = `
      <span class="legend-item"><span class="legend-dot" style="background:#4caf7d"></span>${t("legend-app")}</span>
      <span class="legend-item"><span class="legend-swatch" style="border-color:#7c6af7"></span>${t("legend-model")}</span>
      <span class="legend-item" style="color:var(--text2);font-size:11px;">${t("legend-eval")}</span>`;
  }
}

async function exportDiagramPNG() {
  if (!MODEL) return;
  const safeName = (MODEL.name || "model").replace(/[^a-z0-9_-]/gi, "_") + "_diagram";
  try {
    await DiagramRenderer.exportPNG(MODEL, LANG, safeName);
  } catch (e) {
    window.electronAPI.showError("Export Error", "PNG export failed:\n" + e.message);
  }
}

function exportDiagramSVG() {
  if (!MODEL) return;
  const safeName = (MODEL.name || "model").replace(/[^a-z0-9_-]/gi, "_") + "_diagram";
  DiagramRenderer.exportSVG(MODEL, LANG, safeName);
}

// ── Wire all buttons on DOMContentLoaded ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Language toggle
  document.getElementById("btn-lang").addEventListener("click", () => {
    LANG = LANG === "en" ? "zh" : "en";
    applyLang();
  });

  // Top bar
  document.getElementById("btn-new").addEventListener("click",        newModel);
  document.getElementById("btn-open").addEventListener("click",       openFile);
  document.getElementById("btn-diagram").addEventListener("click",    showDiagram);
  document.getElementById("btn-export").addEventListener("click",     exportModel);
  document.getElementById("btn-compliance").addEventListener("click", runComplianceCheck);

  // Welcome screen
  document.getElementById("btn-welcome-new").addEventListener("click",  newModel);
  document.getElementById("btn-welcome-open").addEventListener("click", openFile);

  // Sidebar
  document.getElementById("btn-add-element").addEventListener("click",  () => showAddElement());
  document.getElementById("btn-show-workflow").addEventListener("click", showWorkflow);

  // Dashboard
  document.getElementById("btn-dash-compliance").addEventListener("click", runComplianceCheck);
  document.getElementById("btn-dash-export").addEventListener("click",     exportModel);
  document.getElementById("btn-add-ai-app").addEventListener("click",      () => showAddElement("ai-app"));
  document.getElementById("btn-add-ai-model").addEventListener("click",    () => showAddElement("ai-model"));
  document.getElementById("btn-add-assessment").addEventListener("click",  () => showAddElement("assessment"));
  document.getElementById("btn-add-role").addEventListener("click",        () => showAddElement("role"));
  document.getElementById("btn-add-constraint").addEventListener("click",  () => showAddElement("constraint"));

  // Element editor
  document.getElementById("btn-el-back").addEventListener("click",   showDashboard);
  document.getElementById("btn-el-delete").addEventListener("click", deleteCurrentElement);

  // Add element page
  document.getElementById("btn-add-cancel").addEventListener("click",    showDashboard);
  document.getElementById("btn-create-element").addEventListener("click", createNewElement);
  document.getElementById("new-el-type").addEventListener("change",       updateAddHint);

  // Compliance page
  document.getElementById("btn-compliance-back").addEventListener("click",  showDashboard);
  document.getElementById("btn-compliance-rerun").addEventListener("click", () => renderComplianceResults());

  // Diagram page
  document.getElementById("btn-diagram-back").addEventListener("click",       showDashboard);
  document.getElementById("btn-diagram-export-png").addEventListener("click", exportDiagramPNG);
  document.getElementById("btn-diagram-export-svg").addEventListener("click", exportDiagramSVG);

  // Workflow page
  document.getElementById("btn-workflow-back").addEventListener("click", showDashboard);

  // Menu events from main process
  window.electronAPI.onMenuNew(()        => newModel());
  window.electronAPI.onMenuSave(()       => exportModel());
  window.electronAPI.onMenuExport(()     => exportModel());
  window.electronAPI.onMenuCompliance(() => runComplianceCheck());
  window.electronAPI.onMenuAbout(()      => window.electronAPI.showInfo(t("about-title"), t("about-body")));

  // File opened via menu
  window.electronAPI.onFileOpened((event, { path: filePath, content }) => {
    try {
      const parser  = new DOMParser();
      const doc     = parser.parseFromString(content, "text/xml");
      const modelEl = doc.querySelector("model");
      const name    = modelEl?.getAttribute("name") || filePath.split("/").pop().replace(".archimate","");
      const elements = [];

      doc.querySelectorAll("elements > element").forEach(el => {
        const xsiType = el.getAttribute("xsi:type") || "";
        const type    = Object.entries(ArchiMateGenerator.TYPE_MAP).find(([, v]) => v === xsiType)?.[0] || "role";
        const props   = {};
        el.querySelectorAll("properties > property").forEach(p => {
          props[p.getAttribute("key")] = p.getAttribute("value");
        });
        elements.push({
          id:          el.getAttribute("id") || uid(),
          type,
          name:        el.getAttribute("name") || "Unnamed",
          description: el.querySelector("documentation")?.textContent || "",
          props,
        });
      });

      MODEL = { name, description: "", elements, relationships: [] };
      CURRENT_ELEMENT = null;
      document.getElementById("btn-add-element").disabled = false;
      setDirty(false);
      showDashboard();
    } catch (err) {
      window.electronAPI.showError("Parse Error", t("parse-err") + err.message);
    }
  });

  // Initial render
  applyLang();
  showPage("welcome");
});
