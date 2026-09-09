import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { ProductLandingPage } from "./ProductLandingPage";
const meta = {
  title: "Pages/Landing/Audio",
  component: ProductLandingPage,
  decorators: [withRouter],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductLandingPage>;
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
