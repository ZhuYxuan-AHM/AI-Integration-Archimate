/*
 * compliance-checker.js
 * Runs 5 compliance checks on all «AI Application» elements.
 * Returns structured result objects for display.
 */

const ComplianceChecker = {

  run(model) {
    const aiApps = (model.elements || []).filter(e => e.type === "ai-app");
    const results = { checks: [], passed: 0, total: 0, elements: aiApps.length };

    if (aiApps.length === 0) {
      return { ...results, noElements: true };
    }

    for (const el of aiApps) {
      const p = el.props || {};

      // ── C1: Responsibility Profile complete ──────────────────────────
      const respKeys = [
        "selection_responsible", "selection_doc_link",
        "design_responsible", "design_doc_link",
        "review_responsible", "review_mechanism",
        "monitoring_responsible", "monitoring_dashboard",
        "data_governance_responsible", "data_governance_doc_link",
      ];
      const requiredRespKeys = [
        "selection_responsible", "design_responsible", "review_responsible",
        "review_mechanism", "monitoring_responsible", "data_governance_responsible"
      ];
      const missingResp = requiredRespKeys.filter(k => !p[k] || p[k].trim() === "");
      results.checks.push({
        id: "C1", element: el.name,
        pass: missingResp.length === 0,
        label: "C1 — Responsibility Profile complete",
        labelCN: "责任配置文件完整性",
        detail: missingResp.length === 0
          ? "All required responsibility fields are filled."
          : `${missingResp.length} required field(s) missing: ${missingResp.join(", ")}`,
        action: missingResp.length > 0 ? "Open element → Responsibility tab to fill missing fields." : null,
      });
      results.total++;
      if (missingResp.length === 0) results.passed++;

      // ── C2: 3+ candidate models ──────────────────────────────────────
      const candidates = (p["candidate_models"] || "").split(",").map(s => s.trim()).filter(Boolean);
      results.checks.push({
        id: "C2", element: el.name,
        pass: candidates.length >= 3,
        label: "C2 — 3+ candidate AI models evaluated",
        labelCN: "至少评估3个候选AI模型",
        detail: candidates.length >= 3
          ? `${candidates.length} candidates: ${candidates.join(", ")}`
          : `Only ${candidates.length} candidate(s) found. Need at least 3.`,
        action: candidates.length < 3 ? "Open element → Model Evaluation tab → fill candidate_models with 3+ models." : null,
      });
      results.total++;
      if (candidates.length >= 3) results.passed++;

      // ── C3: Client has selected a model ─────────────────────────────
      const clientModel = (p["client_selected_model"] || "").trim();
      results.checks.push({
        id: "C3", element: el.name,
        pass: clientModel !== "",
        label: "C3 — Client model selection complete",
        labelCN: "客户方已完成选型决策",
        detail: clientModel !== ""
          ? `Client selected: "${clientModel}"`
          : "client_selected_model is empty — CLIENT ACTION REQUIRED.",
        action: clientModel === "" ? "This field must be filled by the CLIENT (not the architect). Open element → Model Evaluation tab → Client Decision section." : null,
        clientAction: clientModel === "",
      });
      results.total++;
      if (clientModel !== "") results.passed++;

      // ── C4: client_selection_date after evaluation_date ─────────────
      const evalDateStr   = (p["evaluation_date"]       || "").trim();
      const clientDateStr = (p["client_selection_date"] || "").trim();
      let c4pass = false, c4detail = "", c4action = null;

      if (!evalDateStr && !clientDateStr) {
        c4detail = "Both dates empty — fill Evaluation Date and (client fills) Selection Date.";
        c4action = "Open element → Model Evaluation tab.";
      } else if (!evalDateStr) {
        c4detail = "Evaluation Date missing.";
        c4action = "Open element → Model Evaluation tab → fill evaluation_date.";
      } else if (!clientDateStr) {
        c4detail = "client_selection_date missing — client must fill this.";
        c4action = "Client must open element → Model Evaluation tab → Client Decision section.";
      } else {
        const evalDate   = new Date(evalDateStr);
        const clientDate = new Date(clientDateStr);
        if (isNaN(evalDate.getTime()) || isNaN(clientDate.getTime())) {
          c4detail = `Invalid date format. Use YYYY-MM-DD. Found: eval="${evalDateStr}", client="${clientDateStr}"`;
        } else if (clientDate >= evalDate) {
          c4pass = true;
          c4detail = `✓ Selection (${clientDateStr}) is after evaluation (${evalDateStr}).`;
        } else {
          c4detail = `INVALID: client_selection_date (${clientDateStr}) is BEFORE evaluation_date (${evalDateStr}).`;
          c4action = "Correct the dates — client cannot select a model before it was evaluated.";
        }
      }
      results.checks.push({
        id: "C4", element: el.name,
        pass: c4pass,
        label: "C4 — Selection date after evaluation date",
        labelCN: "选型日期晚于评估日期",
        detail: c4detail,
        action: c4action,
      });
      results.total++;
      if (c4pass) results.passed++;

      // ── C5: Compliance Profile with compliance_officer ───────────────
      const officer = (p["compliance_officer"] || "").trim();
      results.checks.push({
        id: "C5", element: el.name,
        pass: officer !== "",
        label: "C5 — AI Compliance Profile with compliance_officer",
        labelCN: "AI合规配置文件含合规负责人",
        detail: officer !== ""
          ? `Compliance Officer: ${officer}`
          : "compliance_officer is empty.",
        action: officer === "" ? "Open element → AI Compliance tab → fill compliance_officer." : null,
      });
      results.total++;
      if (officer !== "") results.passed++;
    }

    return results;
  },

};
