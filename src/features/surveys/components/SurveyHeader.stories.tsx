import type { Meta, StoryObj } from "@storybook/react-vite";
import { initialSurveys } from "@/features/surveys/model/surveys";
import { SurveyHeader } from "./SurveyHeader";

const survey = initialSurveys()[0];

if (!survey) {
  throw new Error("Survey fixture is required");
}

const meta = {
  title: "Features/Surveys/Header",
  component: SurveyHeader,
  args: {
    survey,
    disabled: false,
    onEdit: () => {},
    onPublish: () => {},
    onRespond: () => {},
    onClose: () => {},
    onResults: () => {},
  },
} satisfies Meta<typeof SurveyHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Draft: Story = {
  args: { survey: { ...survey, status: "draft" } },
};

export const Closed: Story = {
  args: { survey: { ...survey, status: "closed" } },
};

export const Disabled: Story = { args: { disabled: true } };
