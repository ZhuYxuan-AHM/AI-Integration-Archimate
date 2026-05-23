/*
 * app.js — Main UI controller
 * Manages state, renders views, and wires up all user interactions.
 */

// ── In-memory model state ─────────────────────────────────────────────────
let MODEL = null;            // { name, description, elements: [], relationships: [] }
let CURRENT_ELEMENT = null;  // currently selected element id
let DIRTY = false;           // unsaved changes

// ── Utilities ─────────────────────────────────────────────────────────────
function uid() {
  return "el-" + Math.random().toString(36).slice(2, 10);
}

function getEl(id) {
  return (MODEL?.elements || []).find(e => e.id === id) || null;
}

function setDirty(val = true) {
  DIRTY = val;
  const name = MODEL?.name || "Untitled";
  document.getElementById("topbar-model-name").textContent = name + (val ? " •" : "");
}

function showPage(id) {
  ["welcome","page-dashboard","page-element","page-add-element","page-compliance"]
    .forEach(p => document.getElementById(p).classList.toggle("hidden", p !== id));
}

// Element type metadata
const EL_META = {
  "ai-app":     { label: "«AI Application»", icon: "🤖", color: "#7c6af7" },
  "ai-model":   { label: "«AI Model»",        icon: "📦", color: "#4caf7d" },
  "assessment": { label: "«AI Diagnostic Assessment»", icon: "📊", color: "#f5a623" },
  "role":       { label: "Business Role",     icon: "👤", color: "#5bc4e5" },
  "actor":      { label: "Business Actor",    icon: "👥", color: "#5bc4e5" },
  "process":    { label: "Business Process",  icon: "⚙️", color: "#9e9e9e" },
  "function":   { label: "Business Function", icon: "🏢", color: "#9e9e9e" },
  "constraint": { label: "Constraint",        icon: "🚧", color: "#e05c6a" },
  "stakeholder":{ label: "Stakeholder",       icon: "🎯", color: "#ab7de8" },
  "driver":     { label: "Driver",            icon: "🔥", color: "#f5a623" },
  "goal":       { label: "Goal",              icon: "🏆", color: "#4caf7d" },
  "principle":  { label: "Principle",         icon: "📜", color: "#5bc4e5" },
};

// ── Model management ──────────────────────────────────────────────────────
const App = {

  newModel() {
    const name = prompt("Model name / 模型名称:", "My AI Integration Model");
    if (!name) return;
    MODEL = { name, description: "", elements: [], relationships: [] };
    CURRENT_ELEMENT = null;
    setDirty(false);
    document.getElementById("btn-add-element").disabled = false;
    this.showDashboard();
    this.renderSidebar();
  },

  async openFile() {
    await window.electronAPI.openFile();
    // Response handled via onFileOpened listener below
  },

  showDashboard() {
    if (!MODEL) { showPage("welcome"); return; }
    CURRENT_ELEMENT = null;
    showPage("page-dashboard");
    document.getElementById("dashboard-title").textContent = MODEL.name;
    this.renderDashboard();
    this.renderSidebar();
  },

  renderDashboard() {
    if (!MODEL) return;
    const els = MODEL.elements || [];
    const counts = {};
    for (const e of els) counts[e.type] = (counts[e.type] || 0) + 1;

    // Stats
    document.getElementById("stats-row").innerHTML = `
      <div class="stat-box"><div class="stat-num">${els.length}</div><div class="stat-label">Total Elements</div></div>
      <div class="stat-box"><div class="stat-num">${counts["ai-app"] || 0}</div><div class="stat-label">AI Applications</div></div>
      <div class="stat-box"><div class="stat-num">${counts["ai-model"] || 0}</div><div class="stat-label">AI Models</div></div>
      <div class="stat-box"><div class="stat-num">${counts["assessment"] || 0}</div><div class="stat-label">Assessments</div></div>
      <div class="stat-box"><div class="stat-num">${counts["constraint"] || 0}</div><div class="stat-label">Constraints</div></div>
    `;

    this.renderList("ai-app-list",    els.filter(e => e.type === "ai-app"));
    this.renderList("ai-model-list",  els.filter(e => e.type === "ai-model"));
    this.renderList("assessment-list",els.filter(e => e.type === "assessment"));
    this.renderList("role-list",      els.filter(e => ["role","actor","process","function","stakeholder","driver","goal","principle"].includes(e.type)));
    this.renderList("constraint-list",els.filter(e => e.type === "constraint"));
  },

  renderList(containerId, elements) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (elements.length === 0) {
      container.innerHTML = `<div class="text-muted" style="font-size:13px;">None yet. Click "+ Add" to create.</div>`;
      return;
    }
    container.innerHTML = elements.map(el => {
      const meta = EL_META[el.type] || { icon: "⬜", label: el.type };
      const profiles = (PROFILES_FOR_TYPE[el.type] || []);
      const filledBadges = profiles.map(pid => {
        const schema = PROFILES[pid];
        const hasData = schema && schema.sections.some(s => s.fields.some(f => el.props && el.props[f.key]));
        return `<span class="status ${hasData ? "status-pass" : "status-warn"}">${schema?.icon || "?"} ${schema?.label?.split(" /")[0] || pid}</span>`;
      }).join("");
      const mandatoryProfiles = profiles.filter(pid => PROFILES[pid]?.mandatory);
      const allMandatoryFilled = mandatoryProfiles.every(pid => {
        const schema = PROFILES[pid];
        return schema && schema.sections.some(s => s.fields.some(f => el.props && el.props[f.key] && el.props[f.key].trim()));
      });
      const compliance = mandatoryProfiles.length > 0
        ? `<span class="status ${allMandatoryFilled ? "status-pass" : "status-fail"}">${allMandatoryFilled ? "✓ Ready" : "⚠ Incomplete"}</span>`
        : "";
      return `
        <div class="element-card" onclick="App.editElement('${el.id}')">
          <div class="element-type-icon">${meta.icon}</div>
          <div class="element-info">
            <div class="element-name">${el.name}</div>
            <div class="element-type">${meta.label}</div>
            <div class="element-badges mt-8">${filledBadges} ${compliance}</div>
          </div>
        </div>`;
    }).join("");
  },

  renderSidebar() {
    if (!MODEL) return;
    const tree = document.getElementById("sidebar-tree");
    const groups = [
      { label: "Motivation / 动机层", types: ["stakeholder","driver","goal","principle","assessment"] },
      { label: "Business / 业务层",   types: ["function","role","actor","process"] },
      { label: "Application / 应用层",types: ["ai-app","ai-model"] },
      { label: "Constraint / 约束",   types: ["constraint"] },
    ];

    let html = "";
    for (const g of groups) {
      const els = (MODEL.elements || []).filter(e => g.types.includes(e.type));
      if (els.length === 0) continue;
      html += `<div class="tree-section">${g.label}</div>`;
      for (const el of els) {
        const meta = EL_META[el.type] || { icon: "⬜" };
        const active = el.id === CURRENT_ELEMENT ? "active" : "";
        html += `<div class="tree-item ${active}" onclick="App.editElement('${el.id}')">
          <span class="tree-icon">${meta.icon}</span>
          <span>${el.name}</span>
        </div>`;
      }
    }
    if (!html) html = `<div class="text-muted" style="padding:14px;font-size:12px;">No elements yet.</div>`;
    tree.innerHTML = html;
  },

  // ── Element editing ──────────────────────────────────────────────────
  editElement(id) {
    const el = getEl(id);
    if (!el) return;
    CURRENT_ELEMENT = id;
    showPage("page-element");

    const meta = EL_META[el.type] || { icon: "⬜", label: el.type };
    document.getElementById("el-title").textContent = meta.icon + "  " + el.name;
    document.getElementById("el-subtitle").textContent = meta.label;

    this.renderProfileEditor(el);
    this.renderSidebar();
  },

  renderProfileEditor(el) {
    const profiles = PROFILES_FOR_TYPE[el.type] || [];
    const tabsEl   = document.getElementById("profile-tabs");
    const panelsEl = document.getElementById("profile-panels");

    // Always show Basic Info tab first
    let tabsHTML   = `<div class="tab active" data-tab="basic" onclick="App.switchTab('basic')">📝 Basic Info</div>`;
    let panelsHTML = `<div class="tab-panel active" id="panel-basic">${this.buildBasicForm(el)}</div>`;

    for (const pid of profiles) {
      const schema = PROFILES[pid];
      if (!schema) continue;
      const hasData = schema.sections.some(s => s.fields.some(f => el.props && el.props[f.key] && el.props[f.key].trim() !== ""));
      const mandClass = schema.mandatory ? " mandatory" : "";
      const complClass = hasData ? " complete" : "";
      tabsHTML   += `<div class="tab${mandClass}${complClass}" data-tab="${pid}" onclick="App.switchTab('${pid}')">
        ${schema.icon} ${schema.label.split("/")[0].trim()}${schema.mandatory ? '<span class="required">*</span>' : ""}
      </div>`;
      panelsHTML += `<div class="tab-panel" id="panel-${pid}">${this.buildProfileForm(el, schema)}</div>`;
    }

    tabsEl.innerHTML   = tabsHTML;
    panelsEl.innerHTML = panelsHTML;
  },

  buildBasicForm(el) {
    return `
      <div class="card">
        <div class="card-title" style="margin-bottom:16px;">Basic Information / 基本信息</div>
        <div class="form-group">
          <label class="form-label"><span class="cn">名称</span> (Name) <span class="required">*</span></label>
          <input class="form-control" type="text" value="${this.esc(el.name)}"
            oninput="App.updateBasicField('${el.id}','name',this.value)"/>
        </div>
        <div class="form-group">
          <label class="form-label"><span class="cn">描述</span> (Description)</label>
          <textarea class="form-control" rows="4"
            oninput="App.updateBasicField('${el.id}','description',this.value)">${this.esc(el.description || "")}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label"><span class="cn">元素类型</span> (Element Type)</label>
          <input class="form-control" type="text" value="${EL_META[el.type]?.label || el.type}" disabled/>
        </div>
      </div>`;
  },

  buildProfileForm(el, schema) {
    let html = `<div class="card">`;
    if (schema.mandatory) {
      html += `<div class="warning-box" style="margin-bottom:16px;">★ ${schema.description} — mandatory for compliance</div>`;
    }
    for (const section of schema.sections) {
      html += `<div class="form-section-title">${section.title}</div>`;
      // Client warning for model_evaluation sections
      if (section.title.includes("CLIENT")) {
        html += `<div class="warning-box">⚠ Fields in this section must be filled by the CLIENT, not the architect. (Independence principle / 独立性原则)</div>`;
      }
      html += `<div class="form-grid">`;
      for (const field of section.fields) {
        const val = (el.props && el.props[field.key]) || "";
        html += `<div class="form-group">`;
        html += `<label class="form-label"><span class="cn">${field.cn}</span><br>${field.en}${field.required ? '<span class="required"> *</span>' : ""}</label>`;

        if (field.type === "textarea") {
          html += `<textarea class="form-control" rows="3"
            data-key="${field.key}" data-el="${el.id}"
            oninput="App.updateProp('${el.id}','${field.key}',this.value)">${this.esc(val)}</textarea>`;
        } else if (field.type === "select") {
          html += `<select class="form-control" data-key="${field.key}"
            onchange="App.updateProp('${el.id}','${field.key}',this.value)">`;
          for (const opt of (field.options || [])) {
            html += `<option value="${opt}"${val === opt ? " selected" : ""}>${opt}</option>`;
          }
          html += `</select>`;
        } else if (field.type === "date") {
          html += `<input class="form-control" type="date" value="${this.esc(val)}"
            data-key="${field.key}"
            onchange="App.updateProp('${el.id}','${field.key}',this.value)"/>`;
        } else {
          html += `<input class="form-control" type="text" value="${this.esc(val)}"
            data-key="${field.key}"
            oninput="App.updateProp('${el.id}','${field.key}',this.value)"/>`;
        }

        if (field.hint) html += `<div class="form-hint">${field.hint}</div>`;
        html += `</div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
    return html;
  },

  switchTab(tabId) {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tabId));
  },

  updateBasicField(elId, field, value) {
    const el = getEl(elId);
    if (!el) return;
    el[field] = value;
    if (field === "name") {
      document.getElementById("el-title").textContent = (EL_META[el.type]?.icon || "") + "  " + value;
      this.renderSidebar();
    }
    setDirty();
  },

  updateProp(elId, key, value) {
    const el = getEl(elId);
    if (!el) return;
    if (!el.props) el.props = {};
    el.props[key] = value;
    setDirty();
  },

  // ── Add element ──────────────────────────────────────────────────────
  showAddElement(presetType) {
    if (!MODEL) return;
    showPage("page-add-element");
    if (presetType) {
      document.getElementById("new-el-type").value = presetType;
      this.updateAddForm();
    }
  },

  updateAddForm() {
    const type = document.getElementById("new-el-type").value;
    const hint = document.getElementById("new-el-hint");
    const hints = {
      "ai-app":  "Run 00_SETUP_Specializations in Archi to enable this element type, or use this app to generate the model directly. After creation, fill the 3 mandatory profiles (Responsibility, Model Evaluation, AI Compliance).",
      "ai-model":"After creation, fill the Model Spec profile with technical details.",
      "constraint":"After creation, fill the Boundary profile — especially the Design Space field (what IS possible within this constraint).",
    };
    if (hints[type]) {
      hint.textContent = hints[type];
      hint.classList.remove("hidden");
    } else {
      hint.classList.add("hidden");
    }
  },

  createNewElement() {
    if (!MODEL) return;
    const type = document.getElementById("new-el-type").value;
    const name = document.getElementById("new-el-name").value.trim();
    const desc = document.getElementById("new-el-desc").value.trim();
    if (!name) {
      window.electronAPI?.showError("Name Required / 名称必填", "Please enter a name for the element.");
      return;
    }
    const el = { id: uid(), type, name, description: desc, props: {} };
    MODEL.elements.push(el);
    setDirty();

    // Clear form
    document.getElementById("new-el-name").value = "";
    document.getElementById("new-el-desc").value = "";

    this.editElement(el.id);
  },

  deleteCurrentElement() {
    if (!CURRENT_ELEMENT || !MODEL) return;
    const el = getEl(CURRENT_ELEMENT);
    if (!el) return;
    const confirmed = confirm(`Delete "${el.name}"? / 删除"${el.name}"?`);
    if (!confirmed) return;
    MODEL.elements = MODEL.elements.filter(e => e.id !== CURRENT_ELEMENT);
    MODEL.relationships = (MODEL.relationships || []).filter(r => r.source !== CURRENT_ELEMENT && r.target !== CURRENT_ELEMENT);
    CURRENT_ELEMENT = null;
    setDirty();
    this.showDashboard();
  },

  // ── Compliance check ─────────────────────────────────────────────────
  runComplianceCheck() {
    if (!MODEL) {
      window.electronAPI?.showError("No Model", "Please open or create a model first.");
      return;
    }
    showPage("page-compliance");
    const results = ComplianceChecker.run(MODEL);
    const subtitle = document.getElementById("compliance-subtitle");
    const container = document.getElementById("compliance-results");

    if (results.noElements) {
      subtitle.textContent = "No «AI Application» elements found.";
      container.innerHTML = `<div class="card"><p class="text-muted">Add «AI Application» elements to your model first, then run compliance check.</p></div>`;
      return;
    }

    const pct = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
    const statusClass = pct === 100 ? "status-pass" : pct >= 80 ? "status-warn" : "status-fail";
    const statusLabel = pct === 100 ? "✓ FULLY COMPLIANT" : pct >= 80 ? "⚠ MOSTLY COMPLIANT" : "✗ NON-COMPLIANT";
    subtitle.innerHTML = `${results.passed} / ${results.total} checks passed across ${results.elements} AI Application(s) &nbsp; <span class="status ${statusClass}">${statusLabel}</span>`;

    // Group by element
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
          <div class="card-title">🤖 ${elName}</div>
          <span class="status ${elPassed === checks.length ? "status-pass" : "status-fail"}">${elPassed}/${checks.length}</span>
        </div>`;
      for (const c of checks) {
        html += `<div class="check-row">
          <div class="check-icon">${c.pass ? "✅" : c.clientAction ? "🔵" : "❌"}</div>
          <div style="flex:1">
            <div class="check-label">${c.id} — ${c.label} / <span style="color:var(--text2)">${c.labelCN}</span></div>
            <div class="check-detail">${c.detail}</div>
            ${c.action ? `<div class="check-element">→ ${c.action}</div>` : ""}
            ${c.clientAction ? `<div class="check-element" style="color:var(--accent2)">🔵 CLIENT ACTION — This field must be filled by the client organization.</div>` : ""}
          </div>
        </div>`;
      }
      html += `</div>`;
    }
    container.innerHTML = html;
  },

  // ── Export ───────────────────────────────────────────────────────────
  async exportModel() {
    if (!MODEL) {
      window.electronAPI?.showError("No Model", "No model to export. Create one first.");
      return;
    }
    const xml = ArchiMateGenerator.generate(MODEL);
    const safeName = (MODEL.name || "model").replace(/[^a-z0-9_-]/gi, "_") + ".archimate";
    const result = await window.electronAPI.saveFile({ content: xml, defaultName: safeName });
    if (result?.success) {
      window.electronAPI?.showInfo("Exported / 已导出",
        `Model exported to:\n${result.path}\n\nOpen this file in Archi tool for visualization.\n可在Archi工具中打开此文件查看可视化模型。`
      );
      setDirty(false);
    }
  },

  // ── Utility ──────────────────────────────────────────────────────────
  esc(str) {
    return (str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  },
};

// ── Bootstrap ─────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {

  // Menu event listeners
  window.electronAPI?.onMenuNew(()        => App.newModel());
  window.electronAPI?.onMenuSave(()       => App.exportModel());
  window.electronAPI?.onMenuExport(()     => App.exportModel());
  window.electronAPI?.onMenuCompliance(() => App.runComplianceCheck());
  window.electronAPI?.onMenuAbout(()      => window.electronAPI.showInfo("About / 关于",
    "AI Integration Architecture Toolkit v1.0\n\n" +
    "DSR paper design artifact for:\n" +
    "\"Distributed Situation Awareness Breakdown: Why AI Agents Fail in Established Organizations\"\n\n" +
    "Built with Electron + ArchiMate 3.2\n" +
    "Based on Endsley (1995) SA theory and Stanton et al. (2006) DSA theory."));

  // File opened from menu
  window.electronAPI?.onFileOpened((event, { path, content }) => {
    try {
      // Parse the .archimate XML into our in-memory model
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/xml");
      const modelEl = doc.querySelector("model");
      const name = modelEl?.getAttribute("name") || path.split("/").pop().replace(".archimate","");

      const elements = [];
      doc.querySelectorAll("elements > element").forEach(el => {
        const xsiType = el.getAttribute("xsi:type") || "";
        const type = Object.entries(ArchiMateGenerator.TYPE_MAP).find(([k,v]) => v === xsiType)?.[0] || "role";
        const props = {};
        el.querySelectorAll("properties > property").forEach(p => {
          props[p.getAttribute("key")] = p.getAttribute("value");
        });
        elements.push({
          id: el.getAttribute("id") || uid(),
          type,
          name: el.getAttribute("name") || "Unnamed",
          description: el.querySelector("documentation")?.textContent || "",
          props,
        });
      });

      MODEL = { name, description: "", elements, relationships: [] };
      CURRENT_ELEMENT = null;
      document.getElementById("btn-add-element").disabled = false;
      setDirty(false);
      App.showDashboard();
    } catch (err) {
      window.electronAPI.showError("Parse Error", "Could not parse .archimate file:\n" + err.message);
    }
  });

  // Show welcome
  showPage("welcome");
});
