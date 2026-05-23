/* diagram-renderer.js — ArchiMate 3.2 layered SVG diagram */

const DiagramRenderer = (() => {

  // ── Layout constants ──────────────────────────────────────────────────
  const COLS  = 5;
  const BW    = 168, BH = 72;   // box width / height
  const GX    = 14,  GY = 12;   // gap x / y
  const PX    = 28,  PT = 46, PB = 20;  // padding x / top / bottom
  const SVG_W = COLS * (BW + GX) - GX + PX * 2;  // ≈ 944

  // ── Layer definitions (dark-theme ArchiMate colors) ───────────────────
  const LAYERS = [
    { key: "motivation",
      en: "MOTIVATION LAYER", zh: "动机层",
      bg: "#211c08", stripe: "#c09820", border: "#5a4a10",
      types: ["stakeholder","driver","goal","principle","assessment"] },
    { key: "business",
      en: "BUSINESS LAYER", zh: "业务层",
      bg: "#1e1208", stripe: "#c06820", border: "#5a3010",
      types: ["function","role","actor","process"] },
    { key: "application",
      en: "APPLICATION LAYER", zh: "应用层",
      bg: "#081828", stripe: "#4080c0", border: "#10407a",
      types: ["ai-app","ai-model"] },
    { key: "constraint",
      en: "CONSTRAINTS", zh: "约束",
      bg: "#0c1e0c", stripe: "#40a040", border: "#204a20",
      types: ["constraint"] },
  ];

  // ── Element type styling ───────────────────────────────────────────────
  const STYLE = {
    "ai-app":     { abbr:"APP", bg:"#1a1440", bd:"#7c6af7", fg:"#c8c0ff" },
    "ai-model":   { abbr:"MDL", bg:"#0c2040", bd:"#4080c0", fg:"#90c0f0" },
    "assessment": { abbr:"EVL", bg:"#302008", bd:"#c08020", fg:"#f0c060" },
    "role":       { abbr:"ROL", bg:"#2a1808", bd:"#904820", fg:"#d08040" },
    "actor":      { abbr:"ACT", bg:"#2a1808", bd:"#904820", fg:"#d08040" },
    "process":    { abbr:"PRC", bg:"#281808", bd:"#804018", fg:"#c07838" },
    "function":   { abbr:"FNC", bg:"#281808", bd:"#804018", fg:"#c07838" },
    "constraint": { abbr:"CST", bg:"#0c200c", bd:"#208020", fg:"#60c060" },
    "stakeholder":{ abbr:"STK", bg:"#302408", bd:"#a07020", fg:"#e0b040" },
    "driver":     { abbr:"DRV", bg:"#300c0c", bd:"#a03020", fg:"#f06040" },
    "goal":       { abbr:"GOL", bg:"#302408", bd:"#a07020", fg:"#e0b040" },
    "principle":  { abbr:"PRI", bg:"#182030", bd:"#406090", fg:"#80a0d0" },
  };

  const TYPE_LABEL = {
    en: { "ai-app":"«AI Application»","ai-model":"«AI Model»","assessment":"«Assessment»",
          "role":"Business Role","actor":"Business Actor","process":"Business Process",
          "function":"Business Function","constraint":"Constraint","stakeholder":"Stakeholder",
          "driver":"Driver","goal":"Goal","principle":"Principle" },
    zh: { "ai-app":"«AI应用»","ai-model":"«AI模型»","assessment":"«诊断评估»",
          "role":"业务角色","actor":"业务参与者","process":"业务流程",
          "function":"业务职能","constraint":"约束","stakeholder":"利益相关方",
          "driver":"驱动力","goal":"目标","principle":"原则" },
  };

  // ── Layout computation ─────────────────────────────────────────────────
  function lh(n) {  // layer height for n elements
    return PT + PB + Math.max(1, Math.ceil(n / COLS)) * (BH + GY) - GY;
  }

  function layout(elements) {
    const pos = {};
    const bands = [];
    let y = 0;
    for (const ld of LAYERS) {
      const els = elements.filter(e => ld.types.includes(e.type));
      const h   = lh(els.length);
      bands.push({ ld, els, y, h });
      els.forEach((el, i) => {
        const bx = PX + (i % COLS) * (BW + GX);
        const by = y + PT + Math.floor(i / COLS) * (BH + GY);
        pos[el.id] = { x: bx, y: by, cx: bx + BW / 2, cy: by + BH / 2, top: by, bot: by + BH };
      });
      y += h;
    }
    return { pos, bands, totalH: y };
  }

  // ── Relationship inference ─────────────────────────────────────────────
  function inferRels(model) {
    const rels = [];
    const els        = model.elements || [];
    const aiApps     = els.filter(e => e.type === "ai-app");
    const aiModels   = els.filter(e => e.type === "ai-model");
    const constraints= els.filter(e => e.type === "constraint");
    const assessments= els.filter(e => e.type === "assessment");

    // AI App ←→ AI Models: infer from candidate_models / client_selected_model
    for (const app of aiApps) {
      const cands = (app.props?.candidate_models || "").toLowerCase();
      const sel   = (app.props?.client_selected_model || "").toLowerCase();
      let hit = false;
      for (const m of aiModels) {
        const mn = m.name.toLowerCase();
        if (cands.includes(mn) || sel.includes(mn)) {
          const isSelected = sel && (sel.includes(mn) || mn.includes(sel));
          rels.push({ from: app.id, to: m.id,
            stroke: isSelected ? "#7c6af7" : "#304878",
            dash: isSelected ? "" : "5,3", w: isSelected ? 2 : 1.5 });
          hit = true;
        }
      }
      if (!hit) aiModels.forEach(m =>
        rels.push({ from: app.id, to: m.id, stroke: "#2a3848", dash: "4,4", w: 1 }));
    }

    // Constraints → AI Apps (influence — dashed green)
    for (const c of constraints)
      for (const a of aiApps)
        rels.push({ from: c.id, to: a.id, stroke: "#208020", dash: "8,3", w: 1.5 });

    // Assessments → AI Apps (association — dashed amber)
    for (const a of assessments)
      for (const app of aiApps)
        rels.push({ from: a.id, to: app.id, stroke: "#806010", dash: "5,3", w: 1 });

    return rels;
  }

  // ── SVG helpers ────────────────────────────────────────────────────────
  const x = s => (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const clip = (s, n) => s && s.length > n ? s.slice(0, n - 1) + "…" : (s || "");

  // ── Main renderer ──────────────────────────────────────────────────────
  function renderSVG(model, lang) {
    const els = model.elements || [];
    const { pos, bands, totalH } = layout(els);
    const rels = inferRels(model);
    const L = lang || "en";

    const p = [];  // SVG parts

    p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${totalH}" viewBox="0 0 ${SVG_W} ${totalH}">`);
    p.push(`<style>text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;}</style>`);
    p.push(`<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#60608a" opacity="0.8"/></marker></defs>`);
    p.push(`<rect width="${SVG_W}" height="${totalH}" fill="#1e1e2e"/>`);

    // ── Layer bands
    for (const b of bands) {
      const lbl = L === "zh" ? b.ld.zh : b.ld.en;
      p.push(`<rect x="0" y="${b.y}" width="${SVG_W}" height="${b.h}" fill="${b.ld.bg}" stroke="${b.ld.border}" stroke-width="1"/>`);
      p.push(`<rect x="0" y="${b.y}" width="5" height="${b.h}" fill="${b.ld.stripe}"/>`);
      p.push(`<text x="14" y="${b.y + 26}" fill="${b.ld.stripe}" font-size="11" font-weight="700" letter-spacing="1" opacity="0.85">${x(lbl)}</text>`);
      if (b.els.length === 0) {
        const empty = L === "zh" ? "（暂无元素）" : "(no elements — add via dashboard)";
        p.push(`<text x="${PX}" y="${b.y + b.h / 2 + 5}" fill="#404060" font-size="12" font-style="italic">${x(empty)}</text>`);
      }
    }

    // ── Relationship lines
    for (const r of rels) {
      const fp = pos[r.from], tp = pos[r.to];
      if (!fp || !tp) continue;
      const above = fp.cy < tp.cy;
      const x1 = fp.cx, y1 = above ? fp.bot  : fp.top;
      const x2 = tp.cx, y2 = above ? tp.top  : tp.bot;
      const my  = (y1 + y2) / 2;
      p.push(`<path d="M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}" fill="none" stroke="${r.stroke}" stroke-width="${r.w}" stroke-dasharray="${r.dash}" opacity="0.7" marker-end="url(#arr)"/>`);
    }

    // ── Element boxes
    for (const el of els) {
      const bp = pos[el.id];
      if (!bp) continue;
      const st  = STYLE[el.type] || { abbr:"?", bg:"#27273a", bd:"#3d3d5c", fg:"#9898b8" };
      const lbl = (TYPE_LABEL[L] || TYPE_LABEL.en)[el.type] || el.type;
      const nm  = clip(el.name, 20);

      // Box
      p.push(`<rect x="${bp.x}" y="${bp.y}" width="${BW}" height="${BH}" rx="6" fill="${st.bg}" stroke="${st.bd}" stroke-width="1.5"/>`);

      // Abbreviation badge
      p.push(`<rect x="${bp.x + 8}" y="${bp.y + 9}" width="34" height="17" rx="3" fill="${st.bd}" opacity="0.45"/>`);
      p.push(`<text x="${bp.x + 25}" y="${bp.y + 21}" fill="${st.fg}" font-size="10" font-weight="700" text-anchor="middle">${st.abbr}</text>`);

      // Name
      p.push(`<text x="${bp.x + 50}" y="${bp.y + 22}" fill="#e0e0f0" font-size="12" font-weight="600">${x(nm)}</text>`);

      // Type label
      p.push(`<text x="${bp.x + 10}" y="${bp.y + 45}" fill="#6060a0" font-size="10">${x(lbl)}</text>`);

      // ── AI App: profile completion dot
      if (el.type === "ai-app") {
        const ok = ["responsibility","model_evaluation","compliance"].every(pid => {
          const s = PROFILES[pid];
          return s && s.sections.some(sec => sec.fields.some(f => el.props?.[f.key]?.trim()));
        });
        p.push(`<circle cx="${bp.x + BW - 14}" cy="${bp.y + 14}" r="10" fill="${ok ? "#4caf7d" : "#e05c6a"}" opacity="0.9"/>`);
        p.push(`<text x="${bp.x + BW - 14}" y="${bp.y + 18}" fill="white" font-size="12" font-weight="700" text-anchor="middle">${ok ? "✓" : "!"}</text>`);
      }

      // ── AI Model: highlight selected model
      if (el.type === "ai-model") {
        const apps = (model.elements || []).filter(e => e.type === "ai-app");
        const isSel = apps.some(a => {
          const s = (a.props?.client_selected_model || "").toLowerCase().trim();
          return s && (el.name.toLowerCase().includes(s) || s.includes(el.name.toLowerCase()));
        });
        if (isSel) {
          p.push(`<rect x="${bp.x}" y="${bp.y}" width="${BW}" height="${BH}" rx="6" fill="none" stroke="#7c6af7" stroke-width="2.5" opacity="0.9"/>`);
          const selLbl = L === "zh" ? "已选定" : "SELECTED";
          p.push(`<text x="${bp.x + BW - 8}" y="${bp.y + 20}" fill="#7c6af7" font-size="9" font-weight="700" text-anchor="end">${selLbl}</text>`);
        }
      }

      // ── Assessment: SA score
      if (el.type === "assessment") {
        const pa  = parseFloat(el.props?.pa_score)  || 0;
        const ca  = parseFloat(el.props?.ca_score)  || 0;
        const pra = parseFloat(el.props?.pra_score) || 0;
        if (pa || ca || pra) {
          const avg = ((pa + ca + pra) / 3).toFixed(1);
          p.push(`<text x="${bp.x + BW - 8}" y="${bp.y + 22}" fill="#f5a623" font-size="11" font-weight="700" text-anchor="end">SA ${x(avg)}</text>`);
        }
        const vs = el.props?.vertical_sharing_score;
        if (vs) {
          p.push(`<text x="${bp.x + 10}" y="${bp.y + 60}" fill="#5bc4e5" font-size="9">DSA: ${x(vs)}</text>`);
        }
      }
    }

    // ── Legend
    const LY = totalH - 1;
    p.push(`<rect x="0" y="${LY}" width="${SVG_W}" height="1" fill="#3d3d5c" opacity="0.4"/>`);

    p.push(`</svg>`);
    return p.join("\n");
  }

  // ── PNG export via canvas ──────────────────────────────────────────────
  async function exportPNG(model, lang, filename) {
    const svgStr = renderSVG(model, lang);
    const blob   = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url    = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const W = SVG_W * 2, H = img.naturalHeight * 2 || (img.height * 2);
        const canvas = document.createElement("canvas");
        canvas.width  = W || SVG_W * 2;
        canvas.height = H || 800;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(pngBlob => {
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = filename + ".png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
          resolve();
        }, "image/png");
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  function exportSVG(model, lang, filename) {
    const svgStr = renderSVG(model, lang);
    const blob   = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href        = url;
    a.download    = filename + ".svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return { renderSVG, exportPNG, exportSVG, SVG_W };
})();
