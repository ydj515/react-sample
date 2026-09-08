import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar, FilterField } from "./filter-bar";
import { SearchInput } from "./search-input";
import { Select } from "./select";
import { Button } from "./button";
const meta = {
  title: "Shared/UI/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <FilterField label="사용자 검색" grow>
          <SearchInput placeholder="이름, 이메일 검색" />
        </FilterField>
        <FilterField label="상태">
          <Select>
            <option>전체 상태</option>
            <option>활성</option>
          </Select>
        </FilterField>
        <FilterField label="정렬">
          <Select>
            <option>최신순</option>
            <option>이름순</option>
          </Select>
        </FilterField>
        <Button type="reset" variant="secondary">
          초기화
        </Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <form>
        <Story />
      </form>
    ),
  ],
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-[358px]">
        <Story />
      </div>
    ),
  ],
};
