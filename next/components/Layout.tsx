import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { TopNavigation } from "./TopNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="max-w-screen-xl pb-16 sm:pb-0 mx-auto">
      <TopNavigation />
      {children}
      <BottomNavigation />
    </main>
  );
};


export default Layout;
