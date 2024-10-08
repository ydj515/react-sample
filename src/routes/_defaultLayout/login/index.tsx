import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_defaultLayout/login/")({
  component: Login,
});

function Login() {
  return (
    <>
      <div>
        로그인 페이지입니다. 로로로
        <div>sdf</div>
      </div>
    </>
  );
}
