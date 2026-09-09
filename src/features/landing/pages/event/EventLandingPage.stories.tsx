import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { EventLandingPage } from "./EventLandingPage";
const meta = {
  title: "Pages/Landing/Conference",
  component: EventLandingPage,
  decorators: [withRouter],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EventLandingPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mobile: Story = {
  parameters: {
    viewport: {
      options: {
        landingMobile: {
          name: "Landing mobile",
          styles: { width: "390px", height: "844px" },
        },
      },
    },
  },
  globals: { viewport: { value: "landingMobile", isRotated: false } },
};
export const Dark: Story = { globals: { theme: "dark" } };
export const DarkTicketFocus: Story = {
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("link", { name: "모든 랜딩 샘플 ↗" }).focus();
    await userEvent.tab({ shift: true });
    await expect(
      canvas.getByRole("button", { name: "참가 신청 체험" }),
    ).toHaveFocus();
  },
};
