import { updateDisplayName } from "@/app/actions/profile";
import { requireUser, unnamedAccountLabel } from "@/lib/auth";
import {
  ErrorBanner,
  Field,
  Notice,
  PageHeader,
  inputClassName,
  panelClass,
  primaryButtonClass,
} from "@/components/ui";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const { displayName } = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Profile"
        description="Choose the name that appears in the header and on Overview."
      />
      {!displayName ? (
        <Notice>
          This account is labeled <span className="font-medium">{unnamedAccountLabel}</span> until
          you add a display name.
        </Notice>
      ) : null}
      {saved === "1" ? (
        <Notice tone="sage">Your display name is saved.</Notice>
      ) : null}
      <ErrorBanner message={error} />
      <form action={updateDisplayName} className={`${panelClass} space-y-5`}>
        <Field
          label="Display name"
          hint="Leave this blank to keep the label My account. Up to 80 characters."
        >
          <input
            name="display_name"
            defaultValue={displayName ?? ""}
            maxLength={80}
            autoComplete="nickname"
            className={inputClassName()}
            placeholder="Name you want to see"
          />
        </Field>
        <button
          type="submit"
          className={primaryButtonClass()}
        >
          Save name
        </button>
      </form>
    </div>
  );
}
