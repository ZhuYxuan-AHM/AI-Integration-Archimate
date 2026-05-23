const PROFILES = {

  responsibility: {
    id: "responsibility",
    label_en: "📋 Responsibility",
    label_zh: "📋 职责配置",
    icon: "📋",
    mandatory: true,
    appliesTo: ["ai-app"],
    desc_en: "5 responsibility categories — mandatory for compliance check C1",
    desc_zh: "AI应用生命周期5类责任归属 — 合规检查C1必填",
    sections: [
      {
        title_en: "① Selection Responsibility",
        title_zh: "① 选型责任",
        fields: [
          { key: "selection_responsible", cn: "选型负责人",    en: "Selection Responsible Person", type: "text",     required: true,  hint: "Name and/or role — e.g., IT Architect" },
          { key: "selection_doc_link",    cn: "选型文档链接",  en: "Selection Doc Link",           type: "text",     required: false, hint: "URL or file path to selection report" },
        ]
      },
      {
        title_en: "② Process Design Responsibility",
        title_zh: "② 流程设计责任",
        fields: [
          { key: "design_responsible", cn: "设计负责人",   en: "Process Design Responsible", type: "text", required: true },
          { key: "design_doc_link",    cn: "设计文档链接", en: "Design Doc Link",            type: "text", required: false },
        ]
      },
      {
        title_en: "③ Review Responsibility",
        title_zh: "③ 审查责任",
        fields: [
          { key: "review_responsible", cn: "审查负责人",   en: "Review Responsible Person", type: "text",     required: true },
          { key: "review_mechanism",   cn: "审查机制描述", en: "Review Mechanism",          type: "textarea", required: true, hint: "e.g., weekly performance review, real-time escalation flag for confidence < 0.7" },
        ]
      },
      {
        title_en: "④ Monitoring Responsibility",
        title_zh: "④ 监控责任",
        fields: [
          { key: "monitoring_responsible", cn: "监控负责人", en: "Monitoring Responsible Person",  type: "text", required: true },
          { key: "monitoring_dashboard",   cn: "监控仪表盘", en: "Monitoring Dashboard (URL/path)", type: "text", required: false },
        ]
      },
      {
        title_en: "⑤ Data Governance Responsibility",
        title_zh: "⑤ 数据治理责任",
        fields: [
          { key: "data_governance_responsible", cn: "数据治理负责人",   en: "Data Governance Responsible", type: "text", required: true },
          { key: "data_governance_doc_link",    cn: "数据治理文档链接", en: "Data Governance Doc Link",    type: "text", required: false },
        ]
      }
    ]
  },

  model_evaluation: {
    id: "model_evaluation",
    label_en: "🔬 Model Evaluation",
    label_zh: "🔬 模型评估",
    icon: "🔬",
    mandatory: true,
    appliesTo: ["ai-app"],
    desc_en: "Multi-candidate AI model evaluation — compliance checks C2, C3, C4",
    desc_zh: "多候选AI模型评估 — 合规检查C2、C3、C4",
    sections: [
      {
        title_en: "Evaluation Setup (Architect fills)",
        title_zh: "评估设置（架构师填写）",
        fields: [
          { key: "candidate_models",      cn: "候选AI模型",   en: "Candidate Models (comma-separated, min 3)", type: "textarea", required: true, hint: "e.g., GPT-4o, Claude-3-Sonnet, Gemini-1.5-Pro" },
          { key: "evaluation_date",       cn: "评估日期",     en: "Evaluation Date",                          type: "date",     required: true },
          { key: "evaluation_method",     cn: "评估方法",     en: "Evaluation Method",                        type: "textarea", required: true, hint: "e.g., blind A/B test on 200 historical tickets; expert panel scoring" },
          { key: "evaluation_dimensions", cn: "评估维度",     en: "Evaluation Dimensions",                    type: "text",     hint: "e.g., accuracy, cost, latency, compliance, language support" },
          { key: "test_scenarios",        cn: "测试场景",     en: "Test Scenarios",                           type: "textarea", hint: "e.g., customer complaint, product inquiry, warranty claim" },
        ]
      },
      {
        title_en: "Evaluation Results (Architect fills)",
        title_zh: "评估结果（架构师填写）",
        fields: [
          { key: "accuracy_per_model",     cn: "各模型准确率",   en: "Accuracy per Model (comma-separated)",     type: "text", hint: "e.g., 91%, 89%, 87% — same order as candidate list" },
          { key: "monthly_cost_per_model", cn: "各模型月费",     en: "Monthly Cost per Model (comma-separated)", type: "text", hint: "e.g., USD 2200, USD 1800, USD 1500" },
          { key: "latency_per_model",      cn: "各模型延迟",     en: "Latency per Model (comma-separated)",      type: "text", hint: "e.g., 450ms, 620ms, 380ms" },
          { key: "compliance_per_model",   cn: "各模型合规状态", en: "Compliance per Model (comma-separated)",   type: "text", hint: "e.g., pass, pass, conditional" },
        ]
      },
      {
        title_en: "⚠ Client Decision (CLIENT fills — NOT the architect)",
        title_zh: "⚠ 客户方决策（客户方填写——非架构师）",
        fields: [
          { key: "client_selected_model", cn: "客户选定模型", en: "Client Selected Model",    type: "text", required: true, hint: "⚠ Must be filled by CLIENT, not the architect (independence principle)" },
          { key: "client_selection_date", cn: "客户决策日期", en: "Client Selection Date",    type: "date", required: true, hint: "Must be after Evaluation Date above" },
        ]
      }
    ]
  },

  compliance: {
    id: "compliance",
    label_en: "⚖️ AI Compliance",
    label_zh: "⚖️ AI合规",
    icon: "⚖️",
    mandatory: true,
    appliesTo: ["ai-app"],
    desc_en: "Regulatory compliance status — compliance check C5",
    desc_zh: "监管合规状态 — 合规检查C5",
    sections: [
      {
        title_en: "Regulatory Compliance",
        title_zh: "法规合规",
        fields: [
          { key: "applicable_regulations",           cn: "适用法规",       en: "Applicable Regulations",          type: "textarea", required: true, hint: "e.g., GDPR, PDPA, ISO 42001" },
          { key: "compliance_verification",          cn: "合规验证方式",   en: "Compliance Verification Method",  type: "textarea", required: true, hint: "e.g., third-party audit, legal sign-off" },
          { key: "non_transferable_responsibilities",cn: "不可转移责任",   en: "Non-transferable Responsibilities",type: "textarea", hint: "Responsibilities that remain human even when AI is used" },
          { key: "data_localization_required",       cn: "数据本地化要求", en: "Data Localization Required",      type: "select", options: ["Yes", "No", "Partial"], required: true },
          { key: "audit_log_retention",              cn: "审计日志保留期", en: "Audit Log Retention Period",      type: "text", hint: "e.g., 3 years, 7 years" },
          { key: "compliance_officer",               cn: "合规负责人",     en: "Compliance Officer",              type: "text", required: true, hint: "Required for compliance check C5" },
        ]
      }
    ]
  },

  cost: {
    id: "cost",
    label_en: "💰 Cost",
    label_zh: "💰 成本",
    icon: "💰",
    mandatory: false,
    appliesTo: ["ai-app"],
    desc_en: "Operational cost records",
    desc_zh: "运营成本记录",
    sections: [
      {
        title_en: "Cost Breakdown",
        title_zh: "成本明细",
        fields: [
          { key: "currency",             cn: "货币单位",   en: "Currency",              type: "select", options: ["USD", "CNY", "MYR", "EUR", "GBP", "SGD", "JPY"] },
          { key: "monthly_cost",         cn: "月度总费用", en: "Total Monthly Cost",    type: "text", hint: "e.g., 2200" },
          { key: "per_call_cost",        cn: "每次调用费", en: "Per API Call Cost",     type: "text", hint: "e.g., 0.005 (leave blank if flat-rate)" },
          { key: "token_cost",           cn: "Token费用",  en: "Token Cost per 1K",    type: "text", hint: "e.g., 0.03" },
          { key: "billing_cycle",        cn: "计费周期",   en: "Billing Cycle",        type: "text", hint: "e.g., monthly, pay-per-use, annual" },
          { key: "estimated_annual_cost",cn: "预估年费",   en: "Estimated Annual Cost",type: "text", hint: "e.g., 26400" },
        ]
      }
    ]
  },

  model_spec: {
    id: "model_spec",
    label_en: "🔧 Model Spec",
    label_zh: "🔧 模型规格",
    icon: "🔧",
    mandatory: false,
    appliesTo: ["ai-model"],
    desc_en: "AI model technical specification",
    desc_zh: "AI模型技术规格",
    sections: [
      {
        title_en: "Model Specification",
        title_zh: "模型规格",
        fields: [
          { key: "model_name",      cn: "模型名称",     en: "Model Name",           type: "text",   required: true, hint: "e.g., GPT-4o, Claude-3-Sonnet" },
          { key: "provider",        cn: "提供商",       en: "Provider",             type: "text",   required: true, hint: "e.g., OpenAI, Anthropic, Google" },
          { key: "model_type",      cn: "模型类型",     en: "Model Type",           type: "select", options: ["LLM (Large Language Model)", "Multimodal", "Embedding", "Classification", "Computer Vision", "Speech-to-Text", "Other"] },
          { key: "parameter_count", cn: "参数量",       en: "Parameter Count",      type: "text",   hint: "e.g., 175B, unknown (proprietary)" },
          { key: "context_window",  cn: "上下文窗口",   en: "Context Window",       type: "text",   hint: "e.g., 128K tokens" },
          { key: "training_cutoff", cn: "训练截止日期", en: "Training Data Cutoff", type: "text",   hint: "e.g., 2024-04" },
          { key: "api_endpoint",    cn: "API端点",      en: "API Endpoint",         type: "text",   hint: "e.g., https://api.openai.com/v1/chat/completions" },
          { key: "version",         cn: "版本号",       en: "Version",              type: "text",   hint: "e.g., gpt-4o-2024-05-13" },
        ]
      }
    ]
  },

  sa_score: {
    id: "sa_score",
    label_en: "📈 SA Score",
    label_zh: "📈 SA评分",
    icon: "📈",
    mandatory: false,
    appliesTo: ["assessment"],
    desc_en: "Endsley (1995) 3-level Situation Awareness scores",
    desc_zh: "Endsley (1995) 三级态势感知评分",
    sections: [
      {
        title_en: "Situation Awareness Scores (Endsley 1995)",
        title_zh: "态势感知评分（Endsley 1995）",
        fields: [
          { key: "measurement_target", cn: "测量对象",   en: "Measurement Target",        type: "text",     required: true, hint: "Who was measured? e.g., Customer Service Manager" },
          { key: "pa_score",           cn: "L1感知评分", en: "Perception Score (PA)",      type: "text",     required: true, hint: "0–5 scale. e.g., 3.2" },
          { key: "ca_score",           cn: "L2理解评分", en: "Comprehension Score (CA)",   type: "text",     required: true, hint: "0–5 scale. e.g., 2.8" },
          { key: "pra_score",          cn: "L3投射评分", en: "Projection Score (PrA)",     type: "text",     required: true, hint: "0–5 scale. e.g., 1.9" },
          { key: "sample_size",        cn: "样本量",     en: "Sample Size",               type: "text",     hint: "Number of participants" },
          { key: "measurement_date",   cn: "测量日期",   en: "Measurement Date",          type: "date" },
          { key: "measurement_tool",   cn: "测量工具",   en: "Measurement Tool",          type: "select",   options: ["SAGAT", "SART", "SALSA", "Interview / Focus Group", "Survey / Questionnaire", "Observation", "Other"] },
          { key: "interpretation",     cn: "结果解读",   en: "Interpretation",            type: "textarea", hint: "What do these scores mean in context?" },
        ]
      }
    ]
  },

  dsa_score: {
    id: "dsa_score",
    label_en: "🕸 DSA Score",
    label_zh: "🕸 DSA评分",
    icon: "🕸",
    mandatory: false,
    appliesTo: ["assessment"],
    desc_en: "Stanton et al. (2006) Distributed Situation Awareness scores",
    desc_zh: "Stanton等 (2006) 分布式态势感知评分",
    sections: [
      {
        title_en: "Distributed Situation Awareness (Stanton et al. 2006)",
        title_zh: "分布式态势感知（Stanton et al. 2006）",
        fields: [
          { key: "measurement_target",         cn: "测量对象",     en: "Measurement Target",         type: "text",   required: true, hint: "e.g., Operations Manager vs. CS Representatives" },
          { key: "breakdown_type",             cn: "断裂类型",     en: "DSA Breakdown Type",          type: "select", required: true, options: ["vertical (management vs. worker)", "horizontal (cross-department)", "temporal (decision vs. implementation)", "combined (multiple types)"] },
          { key: "vertical_sharing_score",     cn: "垂直共享评分", en: "Vertical SA Sharing Score",   type: "text",   hint: "0–100%. e.g., 31%" },
          { key: "horizontal_sharing_score",   cn: "水平共享评分", en: "Horizontal SA Sharing Score", type: "text",   hint: "0–100%, or N/A" },
          { key: "temporal_consistency_score", cn: "时间一致性",   en: "Temporal Consistency Score",  type: "text",   hint: "0–100%, or N/A" },
          { key: "sample_size",                cn: "样本量",       en: "Sample Size",                type: "text" },
          { key: "measurement_date",           cn: "测量日期",     en: "Measurement Date",           type: "date" },
          { key: "measurement_method",         cn: "测量方法",     en: "Measurement Method",          type: "select", options: ["Interview", "Survey", "Network Analysis", "Observation", "Mixed Methods"] },
        ]
      }
    ]
  },

  boundary: {
    id: "boundary",
    label_en: "🚧 Boundary",
    label_zh: "🚧 边界约束",
    icon: "🚧",
    mandatory: false,
    appliesTo: ["constraint"],
    desc_en: "Organizational boundary constraint and design space",
    desc_zh: "组织边界约束及设计空间",
    sections: [
      {
        title_en: "Organizational Boundary (Principle 2: Organization is a Constraint)",
        title_zh: "组织边界（原则2：组织是约束，非变量）",
        fields: [
          { key: "boundary_type",    cn: "边界类型",  en: "Boundary Type", type: "select", required: true,
            options: ["compliance", "department", "technical", "responsibility", "cultural"] },
          { key: "source",           cn: "约束来源",  en: "Source",        type: "text",   required: true, hint: "e.g., PDPA Section 4, Company Policy v2.3" },
          { key: "rigidity",         cn: "约束刚性",  en: "Rigidity",      type: "select", required: true,
            options: ["hard (immutable — law / physics / signed contract)", "soft (negotiable — policy / culture / budget)"] },
          { key: "design_space",     cn: "设计空间★", en: "Design Space (what architect CAN do within this constraint)", type: "textarea", required: true,
            hint: "★ KEY FIELD: Describe what IS possible, not what is forbidden" },
          { key: "affected_layer",    cn: "影响层",     en: "Affected Layer",    type: "text", hint: "e.g., Application, Business, Technology, All" },
          { key: "affected_elements", cn: "受影响元素", en: "Affected Elements", type: "text", hint: "Comma-separated element names" },
        ]
      }
    ]
  },

};

const PROFILES_FOR_TYPE = {
  "ai-app":      ["responsibility", "model_evaluation", "compliance", "cost"],
  "ai-model":    ["model_spec"],
  "assessment":  ["sa_score", "dsa_score"],
  "constraint":  ["boundary"],
  "role": [], "actor": [], "process": [], "function": [],
  "stakeholder": [], "driver": [], "goal": [], "principle": [],
};
