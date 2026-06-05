import { Outlet } from "react-router";
import { SideNav } from "~/components/SideNav";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <SideNav />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
