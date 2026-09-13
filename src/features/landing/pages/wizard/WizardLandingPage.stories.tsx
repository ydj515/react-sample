import type { Meta, StoryObj } from "@storybook/react-vite";
import { WizardLandingPage } from "./WizardLandingPage";
import "@/features/landing/pages/experience.css";

const meta = {
  title: "Pages/Landing/WizardLandingPage",
  component: WizardLandingPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WizardLandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
