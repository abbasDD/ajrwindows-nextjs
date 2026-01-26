import AdminLoginForm from "@/components/auth/admin.login.form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - AJR Windows",
  description: "Admin Login page",
};
const LoginPage = () => {
  return (
    <div className="flex items-center justify-center gap-5 h-screen w-screen">
      <img src="/hero.jpg" alt="logo" className="w-1/2 h-full" />
      <div className="flex-1">
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
