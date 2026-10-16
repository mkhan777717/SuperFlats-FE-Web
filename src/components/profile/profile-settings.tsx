"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Camera, Lock, LogOut, Mail, Phone, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { logout } from "@/app/(auth)/actions";
import { Field } from "@/components/common/field";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { User as SfUser } from "@/lib/types";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b py-10 first:pt-0 last:border-b-0 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
      <div>
        <h2 className="font-display text-xl font-medium text-primary">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}

const ROLE_LABEL: Record<string, string> = { client: "Renter", admin: "Owner / Admin", agent: "Agent", super_admin: "Super Admin" };

/** Profile photo, personal details and password, shared by the renter and owner areas. */
export function ProfileSettings({ user }: { user: SfUser }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();

  const uploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 10 * 1024 * 1024) return toast.error("Please choose an image under 10 MB.");
    setPhotoBusy(true);
    try {
      const body = new FormData();
      body.append("profile_image", file);
      await clientApi("/user/upload-profile-image", { method: "POST", body });
      toast.success("Profile photo updated");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't upload the photo");
    } finally {
      setPhotoBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    try {
      await clientApi("/user/remove-profile-image", { method: "DELETE" });
      toast.success("Profile photo removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove the photo");
    } finally {
      setPhotoBusy(false);
    }
  };

  const saveDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone_number = String(data.get("phone_number") ?? "").replace(/\D/g, "");
    if (!name) return toast.error("Please enter your name.");
    if (!/^\d{10,15}$/.test(phone_number)) return toast.error("Mobile number must be 10 to 15 digits.");
    setDetailsBusy(true);
    try {
      await clientApi("/user/me", { method: "PUT", body: JSON.stringify({ name, email, phone_number }) });
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update your profile");
    } finally {
      setDetailsBusy(false);
    }
  };

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const oldPassword = String(data.get("oldPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    setPasswordError(undefined);
    if (newPassword.length < 8) return setPasswordError("New password must be at least 8 characters.");
    if (newPassword !== confirm) return setPasswordError("The new passwords don't match.");
    setPasswordBusy(true);
    try {
      await clientApi("/user/update-password", { method: "PUT", body: JSON.stringify({ oldPassword, newPassword }) });
      toast.success("Password changed");
      form.reset();
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Couldn't change your password");
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div>
      <Section title="Profile photo" description="Shown to owners when you request a visit.">
        <div className="flex items-center gap-6">
          <UserAvatar name={user.name} src={user.profile_image} className="size-20 text-xl" />
          <div className="flex flex-wrap gap-2">
            <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            <Button variant="outline" size="sm" loading={photoBusy} onClick={() => fileInput.current?.click()}>
              <Camera aria-hidden /> {user.profile_image ? "Change photo" : "Upload photo"}
            </Button>
            {user.profile_image && (
              <Button variant="ghost" size="sm" disabled={photoBusy} onClick={removePhoto}>
                <Trash2 aria-hidden /> Remove
              </Button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Personal details" description={`Account type: ${ROLE_LABEL[user.role] ?? user.role}`}>
        <form onSubmit={saveDetails} className="grid gap-5">
          <Field label="Full name" name="name" icon={User} defaultValue={user.name} autoComplete="name" required />
          <Field label="Email" name="email" type="email" icon={Mail} defaultValue={user.email} autoComplete="email" required />
          <Field label="Mobile number" name="phone_number" type="tel" inputMode="numeric" icon={Phone} defaultValue={user.phone_number} autoComplete="tel-national" required />
          <div>
            <Button type="submit" loading={detailsBusy}>
              Save changes
            </Button>
          </div>
        </form>
      </Section>

      <Section title="Password" description="Use at least 8 characters.">
        <form onSubmit={changePassword} className="grid gap-5">
          <Field label="Current password" name="oldPassword" type="password" icon={Lock} autoComplete="current-password" required />
          <Field label="New password" name="newPassword" type="password" icon={Lock} autoComplete="new-password" minLength={8} required />
          <Field label="Confirm new password" name="confirm" type="password" icon={Lock} autoComplete="new-password" error={passwordError} required />
          <div>
            <Button type="submit" loading={passwordBusy}>
              Change password
            </Button>
          </div>
        </form>
      </Section>

      <Section title="Sign out" description="Sign out of Superflats on this device.">
        <form action={logout}>
          <Button type="submit" variant="outline">
            <LogOut aria-hidden /> Sign out
          </Button>
        </form>
      </Section>
    </div>
  );
}
