import UpdatePasswordForm from "@/components/auth/update-password.form";
import LayoutXLarge from "@/components/layout/layout-x-large";

export default function UpdatePasswordPage() {
  return (
    <LayoutXLarge>
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <UpdatePasswordForm />
      </div>
    </LayoutXLarge>
  );
}
