"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { useActionState, useState } from "react";
import { ActionState } from "@/lib/auth/middleware";
import config from "@/config";
import { createClient } from "@/supabase/client";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");

  const handleGoogleSignIn = () => {
    const supabase = createClient();
    setLoading(true);
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${config.domainName}/api/auth/callback`,
      },
    });
    setLoading(false);
  };

  const [signInState, signInAction, signInPending] = useActionState<
    ActionState,
    FormData
  >(signIn, { error: "", success: "" });

  const [signUpState, signUpAction, signUpPending] = useActionState<
    ActionState,
    FormData
  >(signUp, { error: "", success: "" });

  const renderWelcomePanel = () => (
    <div className="w-1/2 bg-gradient-to-br from-violet-600 to-violet-800 flex flex-col items-center justify-center text-center text-white p-20 max-md:w-full max-md:py-16">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold max-md:text-4xl mb-2">
          {mode === "signin" ? "Welcome Back" : "Join Us"}
        </h1>
        <div className="w-16 h-1 bg-orange-300 mx-auto my-6 rounded-full"></div>
        <p className="mt-4 text-xl text-gray-100">
          {mode === "signin"
            ? "Log in to manage your restaurant menus and customize your site. Your culinary journey awaits!"
            : "Create your account to get started with MenuForge. Build your digital restaurant presence in minutes."}
        </p>
        
        {mode === "signin" ? (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-gray-200 text-lg">New to MenuForge?</div>
            <Link
              href={`/sign-up${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""}`}
              className="mt-2 px-6 py-2 bg-orange-300 text-violet-900 font-medium rounded-lg hover:bg-orange-400 transition-colors"
            >
              Create an account
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-gray-200 text-lg">Already have an account?</div>
            <Link
              href={`/sign-in${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""}`}
              className="mt-2 px-6 py-2 bg-orange-300 text-violet-900 font-medium rounded-lg hover:bg-orange-400 transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderFormPanel = () => (
    <div className="w-1/2 flex items-center justify-center p-12 bg-zinc-900 max-md:w-full max-md:py-12">
      <form
        action={mode === "signin" ? signInAction : signUpAction}
        className="w-full max-w-md space-y-5"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            {mode === "signin" ? "Sign In" : "Create Your Account"}
          </h2>
          <p className="text-gray-400">
            {mode === "signin" 
              ? "Enter your credentials to access your dashboard" 
              : "Fill out the form below to get started"
            }
          </p>
        </div>

        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="firstName"
              type="text"
              placeholder="First Name"
              required
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
            />
          </div>
        )}
        
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
        />
        
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
        />
        
        {mode === "signup" && (
          <>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
            />
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
            />
          </>
        )}
        
        <Button
          type="submit"
          disabled={mode === "signin" ? signInPending : signUpPending}
          className="w-full mt-6 py-3 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium"
        >
          {(mode === "signin" ? signInPending : signUpPending) ? (
            <Loader2 className="w-5 h-5 mx-auto animate-spin" />
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        {(mode === "signin" ? signInState?.error : signUpState?.error) && (
          <div className="text-sm text-red-400 text-center bg-red-900/20 py-2 px-3 rounded-lg">
            {mode === "signin" ? signInState.error : signUpState.error}
          </div>
        )}

        {mode === "signin" && (
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-violet-400 text-sm hover:text-violet-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        )}

        {mode === "signin" && (
          <>
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-zinc-700 w-full absolute"></div>
              <span className="px-4 text-sm text-gray-500 bg-zinc-900 relative">
                or continue with
              </span>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white flex items-center justify-center py-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="mr-3 w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-900 text-gray-100">
      <div className="flex max-md:flex-col h-full">
        {mode === "signin" ? (
          <>
            {renderFormPanel()}
            {renderWelcomePanel()}
          </>
        ) : (
          <>
            {renderWelcomePanel()}
            {renderFormPanel()}
          </>
        )}
      </div>
    </div>
  );
}