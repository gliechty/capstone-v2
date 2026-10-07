// UI demonstration fixtures only. Not QuestionBank, selection logic, or methodology.
export const MOCK_VERSION = "m1-ui-demo-v1";
export const mockQuestions = [
  { id: "demo-people-training", category: "People", kind: "boolean", title: "Does your team receive workplace safety training?", hint: "Choose one response. These are demonstration questions only.", options: ["Yes", "No"] },
  { id: "demo-people-frequency", category: "People", kind: "categorical", title: "How often does your team discuss workplace wellbeing?", hint: "Choose the response that best describes your example business.", options: ["Regularly", "Occasionally", "Not yet"] },
  { id: "demo-governance-policy", category: "Governance", kind: "boolean", title: "Is someone responsible for your sustainability policies?", hint: "This example demonstrates a yes/no response.", options: ["Yes", "No"] },
  { id: "demo-community-action", category: "Community", kind: "text", title: "Describe one way your business supports its community.", hint: "Use an example, or skip if you do not have an answer." },
  { id: "demo-resources-energy", category: "Resources", kind: "numeric", title: "How much electricity did your business use last month?", hint: "Enter an example value in kWh. Zero is a valid answer; a blank is not zero." },
  { id: "demo-resources-renewable", category: "Resources", kind: "percent", title: "What percentage of that electricity was renewable?", hint: "Enter a percentage from 0 to 100, or skip if unknown." },
] as const;
export type MockQuestion = (typeof mockQuestions)[number];
export type QuestionId = MockQuestion["id"];
export const categories = ["People", "Governance", "Community", "Resources"] as const;
