import type { Metadata } from "next";
import { AssessmentFlow } from "../../features/assessment/assessment-flow";

export const metadata: Metadata = {
  title: "Assessment preview | Capstone",
  description: "Business setup and mock questionnaire interaction preview. No scoring.",
};
export default function AssessmentPage() {
  return <AssessmentFlow />;
}
