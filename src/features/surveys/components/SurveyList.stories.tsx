import type { Meta, StoryObj } from "@storybook/react-vite";
import { initialSurveys } from "@/features/surveys/model/surveys";
import { SurveyList } from "./SurveyList";

const meta = {
  title: "Features/Surveys/List",
  component: SurveyList,
  args: {
    surveys: initialSurveys(),
    selected: "survey-welcome",
    onSelect: () => {},
  },
} satisfies Meta<typeof SurveyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
