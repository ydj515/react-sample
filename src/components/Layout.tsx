import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto flex-grow p-4">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
