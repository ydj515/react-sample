import {
  Controls,
  Description,
  Primary,
  Title,
} from "@storybook/addon-docs/blocks";

// 동시에 실행되는 입력 시나리오가 포커스와 mock 데이터를 공유하지 않도록
// 문서에는 기본 캔버스만 표시하고 상태별 play는 개별 스토리에서 실행한다.
export function FormDocs() {
  return (
    <>
      <Title />
      <Description />
      <p>
        저장·입력 검증·저장 실패 예제는 왼쪽의 개별 스토리를 선택해 실행하세요.
      </p>
      <Primary />
      <Controls />
    </>
  );
}
