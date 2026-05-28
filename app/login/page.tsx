import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { Sparkles } from "@/components/Sparkles";
import { Bow } from "@/components/Bow";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const valid = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (valid) redirect("/");

  const { error } = await searchParams;

  return (
    <main className="relative min-h-dvh flex items-center justify-center px-4">
      <Sparkles />
      <form
        action={loginAction}
        className="relative z-10 flex flex-col items-center gap-6 bg-white/90 backdrop-blur-sm rounded-[40px] p-10 sm:p-12 w-full max-w-md animate-fade-up"
        style={{ boxShadow: "var(--shadow-kawaii-lg)" }}
      >
        <div className="animate-wiggle">
          <Bow size={80} />
        </div>

        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl text-rose-deep">
            cada día una foto de ti
          </h1>
          <p className="font-body text-sm text-plum-soft mt-2">
            ingresa tu palabrita secreta ♡
          </p>
        </div>

        <label className="w-full flex flex-col gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-plum-soft/80">
            contraseña
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="font-body w-full rounded-full border-2 border-rose-soft bg-rose-cloud px-5 py-3 text-plum text-center placeholder:text-plum-soft/50 focus:outline-none focus:border-rose-deep focus:ring-4 focus:ring-rose-soft/40 transition-all"
            placeholder="ʚïɞ"
          />
        </label>

        {error === "wrong" && (
          <p className="font-body text-sm text-rose-bow">
            ay no, esa no es ♡ prueba de nuevo
          </p>
        )}
        {error === "config" && (
          <p className="font-body text-sm text-rose-bow text-center">
            falta APP_PASSWORD en .env.local
          </p>
        )}

        <button
          type="submit"
          className="font-display w-full rounded-full bg-gradient-to-r from-rose-deep to-rose-bow text-white text-lg py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
          style={{ boxShadow: "var(--shadow-kawaii)" }}
        >
          entrar ✨
        </button>
      </form>
    </main>
  );
}
