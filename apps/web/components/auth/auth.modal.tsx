"use client";
import { Activity, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginForm from "./login.form";
import RegisterForm from "./register.form";
import WelcomeSection from "./welcome-section";
import { Button } from "../ui/button";
import ForgotPasswordForm from "./forgot-password.form";

type AuthModalType = "login" | "register" | "forgot-password";
const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AuthModalType>("login");

  const handleChangeType = (type: AuthModalType) => {
    setType(type);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-4 max-sm:flex-col ">
          <Button
            size={"lg"}
            variant={"link"}
            className="text-secondary text-base font-semibold"
            onClick={() => {
              setOpen(true);
              setType("register");
            }}
          >
            Register
          </Button>
          <Button
            size={"lg"}
            variant={"secondary"}
            className="text-base "
            onClick={() => {
              setOpen(true);
              setType("login");
            }}
          >
            Login
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[95vw] sm:min-w-[90vw]  py-0 px-0 overflow-hidden flex items-center gap-2 max-w-[90vw] min-h-[90vh] max-h-[90vh] bg-primary">
        <div className="w-[58%] h-[90vh] grid grid-cols-3 gap-4 max-lg:hidden">
          <WelcomeSection />
        </div>
        <div className="flex-1 px-6 sm:px-12 max-h-[90vh] py-8 overflow-y-auto">
          <Activity mode={type === "register" ? "visible" : "hidden"}>
            <RegisterForm />
          </Activity>
          <Activity mode={type === "login" ? "visible" : "hidden"}>
            <LoginForm setOpen={setOpen} handleChangeType={handleChangeType} />
          </Activity>
          <Activity mode={type === "forgot-password" ? "visible" : "hidden"}>
            <ForgotPasswordForm handleChangeType={handleChangeType} />
          </Activity>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
