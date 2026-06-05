import { NavLink } from "react-router";

const groups = [
  {
    title: "Image Tools",
    links: [
      { to: "/image/compress", label: "Compress" },
      { to: "/image/resize", label: "Resize" },
      { to: "/image/convert", label: "Convert" },
    ],
  },
  {
    title: "Video Tools",
    links: [],
    disabled: true,
  },
  {
    title: "PDF Tools",
    links: [],
    disabled: true,
  },
];

export function SideNav() {
  return (
    <nav className="sidenav">
      <div className="brand">Image Utils</div>
      {groups.map((group) => (
        <div key={group.title} className="nav-group">
          <div className="nav-title">{group.title}</div>
          {group.links.length ? (
            group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))
          ) : (
            <div className="nav-link disabled">Coming soon</div>
          )}
        </div>
      ))}
    </nav>
  );
}
