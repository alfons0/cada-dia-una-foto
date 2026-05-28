import { logoutAction } from "@/app/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-xs font-body text-plum-soft/70 hover:text-rose-deep transition-colors underline-offset-4 hover:underline cursor-pointer"
      >
        cerrar sesión
      </button>
    </form>
  );
}
