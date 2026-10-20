import StudyChecklist from "../../components/StudyChecklist";
import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — StudyBuddy" },
      { name: "description", content: "Your StudyBuddy dashboard." },
    ],
  }),
});

// Lets us read the "user" returned by the parent _authenticated gate.
const parentRoute = getRouteApi("/_authenticated");

function Dashboard() {
  const { user } = parentRoute.useRouteContext();
  const navigate = useNavigate();

  // Ends the session and sends the user back to the login page.
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-card-foreground">StudyBuddy</h1>
        <p className="mt-4 text-sm text-muted-foreground">You are signed in as</p>
        <p className="mt-1 font-medium text-card-foreground">{user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Log out
        </button>
        <StudyChecklist />
      </div>
    </div>
  );
}
