import { CheckEmailNotice } from "@/components/auth-forms";
import { panelClass } from "@/components/ui";

export default function CheckEmailPage() {
  return (
    <div className={`mx-auto max-w-md ${panelClass}`}>
      <CheckEmailNotice />
    </div>
  );
}
