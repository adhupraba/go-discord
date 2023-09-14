import { ReactNode } from "react";

interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return <div className="h-full flex items-center justify-center">{children}</div>;
};

export default AuthLayout;
