import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { getFolderImages } from "@/lib/google-drive";
import { pickIndexForDay, pickMessageForDay, getDateKey, formatHumanDate } from "@/lib/daily-pick";
import { dailyMessages } from "@/lib/messages";
import { PhotoFrame } from "@/components/PhotoFrame";
import { DailyMessage } from "@/components/DailyMessage";
import { Sparkles } from "@/components/Sparkles";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const valid = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!valid) redirect("/login");

  const dateKey = getDateKey();
  const humanDate = formatHumanDate(dateKey);

  let content: React.ReactNode;
  try {
    const items = await getFolderImages();
    if (items.length === 0) {
      content = (
        <EmptyState
          title="La carpeta está vacía"
          detail="Sube fotos a la carpeta de Drive configurada y vuelve a recargar."
        />
      );
    } else {
      const index = pickIndexForDay(items, dateKey);
      const picked = items[index];
      const width = picked.imageMediaMetadata?.width || 1600;
      const height = picked.imageMediaMetadata?.height || 1200;
      const src = `/api/photo/${encodeURIComponent(picked.id)}`;
      const message = pickMessageForDay(dailyMessages, dateKey);

      content = (
        <>
          <PhotoFrame src={src} alt={picked.name} width={width} height={height} />
          <DailyMessage message={message} />
        </>
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    content = (
      <EmptyState
        title="No pude traer la foto"
        detail={msg}
      />
    );
  }

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-10 sm:py-16">
      <Sparkles />
      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 max-w-2xl w-full">
        <header className="flex flex-col items-center gap-2 text-center animate-fade-up">
          <p className="font-body text-sm sm:text-base text-plum-soft tracking-wide">
            ✨ {humanDate} ✨
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-tight text-rose-deep drop-shadow-sm">
            cada día una foto de ti
          </h1>
          <p className="font-body text-sm text-plum-soft/80 italic">
            ♡ mi rinconcito favorito ♡
          </p>
        </header>

        {content}
      </div>

      <footer className="relative z-10 mt-12 sm:mt-16 flex flex-col items-center gap-2">
        <p className="font-body text-xs text-plum-soft/60">hecho con cariño 🎀</p>
        <LogoutButton />
      </footer>
    </main>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-8 max-w-md text-center shadow-[var(--shadow-kawaii)]">
      <p className="font-display text-2xl text-rose-deep mb-2">{title}</p>
      <p className="font-body text-sm text-plum-soft break-words">{detail}</p>
    </div>
  );
}
