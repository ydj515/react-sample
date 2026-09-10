import type { Decorator } from "@storybook/react-vite";
import { QueryStory } from "./QueryStory";

export const withManagementApi: Decorator = (Story, context) => (
  <QueryStory key={context.id}>
    <Story />
  </QueryStory>
);
