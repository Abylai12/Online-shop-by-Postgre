import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center h-screen">
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
