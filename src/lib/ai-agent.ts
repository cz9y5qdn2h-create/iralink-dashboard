import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Tu es Iralink, un agent IA expert en automatisation d'entreprise. Tu travailles pour Iralink Agency.

Ton role :
- Analyser les processus et documents d'une entreprise
- Identifier les taches repetitives automatisables
- Suggerer et creer des automatisations concretes
- Donner des recommandations chiffrees (temps gagne, ROI)
- Etre direct, factuel, et pedagogue

Ton ton : direct et concret, jamais vague. Tu donnes des chiffres, des outils precis (Make, Zapier, Notion, Google Workspace, Slack, etc.), et des estimations de temps gagne. Tu ne fais pas de promesses vagues.

Quand tu analyses un document ou un processus :
1. Identifie les taches repetitives
2. Estime le temps passe manuellement
3. Propose une automatisation concrete
4. Estime le temps recuperable
5. Donne un niveau de complexite (faible/moyen/eleve)
6. Recommande les outils necessaires

Tu reponds toujours en francais.`;

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnalysisResult {
  score: number;
  findings: {
    category: string;
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    time_saved_potential: number;
    tools: string[];
  }[];
  automations_suggested: {
    name: string;
    description: string;
    trigger: string;
    actions: string[];
    time_saved_hours: number;
    complexity: "low" | "medium" | "high";
    tools: string[];
  }[];
  summary: string;
}

// Chat with the AI assistant
export async function chat(
  messages: AIMessage[],
  context?: string
): Promise<string> {
  const systemPrompt = context
    ? `${SYSTEM_PROMPT}\n\nContexte de l'entreprise du client :\n${context}`
    : SYSTEM_PROMPT;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : "Je n'ai pas pu generer de reponse.";
}

// Analyze a document/text for automation opportunities
export async function analyzeDocument(
  documentText: string,
  companyContext: string
): Promise<AnalysisResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyse ce document dans le contexte de cette entreprise et identifie toutes les opportunites d'automatisation.

CONTEXTE ENTREPRISE :
${companyContext}

DOCUMENT A ANALYSER :
${documentText}

Reponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "score": <number 0-100>,
  "findings": [
    {
      "category": "<string: Processus|Communication|Donnees|Securite|Opportunite>",
      "title": "<string>",
      "description": "<string>",
      "severity": "<high|medium|low>",
      "time_saved_potential": <number hours/week>,
      "tools": ["<tool1>", "<tool2>"]
    }
  ],
  "automations_suggested": [
    {
      "name": "<string>",
      "description": "<string>",
      "trigger": "<string>",
      "actions": ["<step1>", "<step2>"],
      "time_saved_hours": <number per week>,
      "complexity": "<low|medium|high>",
      "tools": ["<tool1>", "<tool2>"]
    }
  ],
  "summary": "<string: resume en 2-3 phrases>"
}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock ? textBlock.text : "{}";

  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1]!.trim()) as AnalysisResult;
  } catch {
    return {
      score: 0,
      findings: [],
      automations_suggested: [],
      summary: "Erreur lors de l'analyse. Veuillez reessayer.",
    };
  }
}

// Analyze company processes from a description
export async function analyzeProcesses(
  processDescription: string,
  industry: string,
  teamSize: number
): Promise<AnalysisResult> {
  const context = `Secteur : ${industry}\nTaille equipe : ${teamSize} personnes`;
  return analyzeDocument(processDescription, context);
}

// Generate automation configuration
export async function generateAutomation(
  automationName: string,
  description: string,
  availableIntegrations: string[]
): Promise<{
  trigger: string;
  steps: { action: string; tool: string; config_hint: string }[];
  estimated_time_saved: number;
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Genere la configuration d'automatisation pour :
Nom : ${automationName}
Description : ${description}
Integrations disponibles : ${availableIntegrations.join(", ")}

Reponds UNIQUEMENT en JSON valide :
{
  "trigger": "<string: declencheur>",
  "steps": [
    {"action": "<string>", "tool": "<string>", "config_hint": "<string>"}
  ],
  "estimated_time_saved": <number hours/week>
}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock ? textBlock.text : "{}";

  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1]!.trim());
  } catch {
    return {
      trigger: "Manuel",
      steps: [],
      estimated_time_saved: 0,
    };
  }
}

// Weekly analysis summary
export async function generateWeeklySummary(
  automations: { name: string; runs: number; success_rate: number; time_saved: number }[],
  integrations: string[],
  previousScore: number
): Promise<{
  summary: string;
  new_recommendations: string[];
  score: number;
  highlights: string[];
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Genere le resume hebdomadaire de performance.

Automatisations actives :
${automations.map((a) => `- ${a.name}: ${a.runs} executions, ${a.success_rate}% succes, ${a.time_saved}h sauvees`).join("\n")}

Integrations connectees : ${integrations.join(", ")}
Score precedent : ${previousScore}/100

Reponds UNIQUEMENT en JSON valide :
{
  "summary": "<string: resume 2-3 phrases>",
  "new_recommendations": ["<string>", "<string>"],
  "score": <number 0-100>,
  "highlights": ["<string: fait marquant>"]
}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock ? textBlock.text : "{}";

  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1]!.trim());
  } catch {
    return {
      summary: "Analyse en cours...",
      new_recommendations: [],
      score: previousScore,
      highlights: [],
    };
  }
}
