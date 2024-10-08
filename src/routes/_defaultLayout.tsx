import { Outlet, createFileRoute } from "@tanstack/react-router";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";

export const Route = createFileRoute("/_defaultLayout")({
  component: DefaultLayoutComponent,
});

function DefaultLayoutComponent() {
  return (
    <>
      <Header />
      <div className="flex-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
