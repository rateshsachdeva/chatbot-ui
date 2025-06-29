/* app/[locale]/login/page.tsx
   --------------------------------------------------------------- */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/supabase/types";
import { createServerClient } from "@supabase/ssr";
import { get } from "@vercel/edge-config";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Brand } from "@/components/ui/brand";

/* ──────────────────────────────────────────────────────────
   THEME SWITCHER — client-side only
   ────────────────────────────────────────────────────────── */
 const ThemeSwitcher = dynamic(
   () => import("@/components/utility/theme-switcher").then((m) => m.ThemeSwitcher),
   { ssr: false }
 );
 
 /* Brand renders ChatbotUISVG (uses useTheme), so make it client-only too */
 const Brand = dynamic(
   () => import("@/components/ui/brand").then((m) => m.Brand),
   { ssr: false }
 );

/* ──────────────────────────────────────────────────────────
   PAGE METADATA
   ────────────────────────────────────────────────────────── */
export const metadata: Metadata = { title: "Login" };

/* ──────────────────────────────────────────────────────────
   PAGE COMPONENT
   ────────────────────────────────────────────────────────── */
export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  /* ---------- SESSION CHECK ---------- */
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (n: string) => cookieStore.get(n)?.value },
    }
  );

  const session = (await supabase.auth.getSession()).data.session;

  if (session) {
    const { data: homeWorkspace } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
      .maybeSingle();

    if (homeWorkspace) {
      return redirect(`/${homeWorkspace.id}/chat`);
    }
    return redirect("/setup");
  }

  /* ────────────────────────────────────────────────────────
     HELPER: get ENV or Edge-Config value
     ──────────────────────────────────────────────────────── */
  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server";
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name);
    }
    return process.env[name];
  };

  /* ────────────────────────────────────────────────────────
     ACTION: SIGN IN
     ──────────────────────────────────────────────────────── */
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${error.message}`);
    }

    const { data: homeWorkspace } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true)
      .maybeSingle();

    if (homeWorkspace) {
      return redirect(`/${homeWorkspace.id}/chat`);
    }

    return redirect("/setup");
  };

  /* ────────────────────────────────────────────────────────
     ACTION: SIGN UP   (email / domain whitelist, profile row,
     default workspace creation — identical to your original)
     ──────────────────────────────────────────────────────── */
  const signUp = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    /* ----- whitelist check ----- */
    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    );
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString.split(",")
      : [];
    const emailWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_WHITELIST"
    );
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString.split(",")
      : [];

    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist.includes(email.split("@")[1]);
      const emailMatch = emailWhitelist.includes(email);
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        );
      }
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    /* ----- create auth user ----- */
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            user_name: email.split("@")[0],
          },
        },
      }
    );

    if (signUpError || !signUpData?.user) {
      return redirect(
        `/login?message=${signUpError?.message || "Signup failed"}`
      );
    }

    const user = signUpData.user;

    /* ----- create profile row ----- */
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        user_id: user.id,
        username: user.user_metadata.user_name,
      },
    ]);

    if (profileError) {
      await supabase.auth.admin.deleteUser(user.id);
      return redirect(`/login?message=Profile setup failed.`);
    }

    /* ----- ensure a home workspace exists ----- */
    const { data: existingWorkspace } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_home", true)
      .maybeSingle();

    let workspaceId = existingWorkspace?.id;

    if (!workspaceId) {
      const { data: newWorkspace, error: insertError } = await supabase
        .from("workspaces")
        .insert([
          {
            user_id: user.id,
            name: "Home",
            is_home: true,
            default_model:
              (await getEnvVarOrEdgeConfigValue("DEFAULT_MODEL")) || "gpt-4-o",
            default_prompt:
              (await getEnvVarOrEdgeConfigValue("DEFAULT_PROMPT")) ||
              "You are a friendly, helpful AI assistant.",
            default_temperature:
              (await get<number>("DEFAULT_TEMPERATURE")) || 0.5,
            description: "Home workspace",
            include_profile_context: true,
            include_workspace_instructions: true,
            instructions: "",
          },
        ])
        .select()
        .single();

      if (insertError || !newWorkspace) {
        return redirect(`/login?message=Workspace setup failed.`);
      }
      workspaceId = newWorkspace.id;
    }

    /* Supabase will send confirmation email */
    return redirect("/login?message=Success! Check your email to confirm.");
  };

  /* ────────────────────────────────────────────────────────
     ACTION: RESET PASSWORD
     ──────────────────────────────────────────────────────── */
  const handleResetPassword = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`,
    });

    if (error) {
      return redirect(`/login?message=${error.message}`);
    }

    return redirect("/login?message=Check email to reset password");
  };

  /* ────────────────────────────────────────────────────────
     JSX
     ──────────────────────────────────────────────────────── */
  return (
    <>
      {/* Light/Dark toggle */}
      <div className="fixed bottom-4 left-4 z-20">
        <ThemeSwitcher />
      </div>

      {/* Login card */}
      <div className="relative flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        <form
          className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
          action={signIn}
        >
          <Brand />

          <Label className="text-md mt-4" htmlFor="email">
            Email
          </Label>
          <Input
            className="mb-3 rounded-md border bg-inherit px-4 py-2"
            name="email"
            placeholder="you@example.com"
            required
          />

          <Label className="text-md" htmlFor="password">
            Password
          </Label>
          <Input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
          />

          <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
            Login
          </SubmitButton>

          <SubmitButton
            formAction={signUp}
            className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
          >
            Sign Up
          </SubmitButton>

          <div className="text-muted-foreground mt-1 flex justify-center text-sm">
            <span className="mr-1">Forgot your password?</span>
            <button
              formAction={handleResetPassword}
              className="text-primary ml-1 underline hover:opacity-80"
            >
              Reset
            </button>
          </div>

          {searchParams?.message && (
            <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
