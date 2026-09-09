import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionTable } from "./collection-table";

const meta = {
  title: "Shared/UI/CollectionTable",
  component: CollectionTable,
  tags: ["autodocs"],
  args: {
    label: "구성원 목록",
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">부서</th>
            <th scope="col">역할</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>김민준</td>
            <td>운영팀</td>
            <td>관리자</td>
          </tr>
          <tr>
            <td>이서연</td>
            <td>고객지원팀</td>
            <td>매니저</td>
          </tr>
        </tbody>
      </>
    ),
  },
} satisfies Meta<typeof CollectionTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const ReportWidth: Story = { args: { minWidth: 520 } };
