import type { Meta, StoryObj } from "@storybook/react-vite";
import { initialSurveys } from "@/features/surveys/model/surveys";
import { SurveyResults } from "./SurveyResults";

const survey = initialSurveys()[0];

if (!survey) {
  throw new Error("Survey fixture is required");
}

const meta = {
  title: "Features/Surveys/Results",
  component: SurveyResults,
  args: { survey },
} satisfies Meta<typeof SurveyResults>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};

export const Collected: Story = {
  args: {
    survey: {
      ...survey,
      responses: [
        {
          id: "r",
          submittedAt: "2026-09-14T00:00:00.000Z",
          answers: {
            "q-feature": "노트",
            "q-rating": "4",
            "q-feedback": "편리합니다.",
          },
        },
      ],
    },
  },
};
