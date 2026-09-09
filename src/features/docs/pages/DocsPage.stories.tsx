import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "@/shared/lib/storybook/with-router";
import { DocsPage } from "./DocsPage";

const meta = {
  title: "Pages/Docs",
  component: DocsPage,
  decorators: [withRouter],
  parameters: { layout: "fullscreen" },
  args: { slug: "getting-started" },
} satisfies Meta<typeof DocsPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const GettingStarted: Story = {};
export const Components: Story = { args: { slug: "components" } };
export const Mobile: Story = {
  parameters: {
    viewport: {
      options: {
        docsMobile: {
          name: "Docs mobile",
          styles: { width: "390px", height: "844px" },
        },
      },
    },
  },
  globals: { viewport: { value: "docsMobile", isRotated: false } },
};
export const NotFound: Story = { args: { slug: "missing" } };
