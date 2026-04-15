import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, HelpCircle, Gamepad2, AlertTriangle, LayoutDashboard, Menu, X, Code2, FlaskConical, Trophy, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import doraemonImg from "@/assets/doraemon.png";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/quiz", label: "Quiz", icon: HelpCircle },
  { path: "/mini-game", label: "Mini Game", icon: Gamepad2 },
  { path: "/playground", label: "Playground", icon: Code2 },
  { path: "/simulation", label: "Simulation", icon: FlaskConical },
  { path: "/failure-lab", label: "Failure Lab", icon: AlertTriangle },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { currentUser, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={doraemonImg} alt="Doraemon" className="w-9 h-9 object-contain" />
          <span className="font-heading font-bold text-lg text-primary hidden sm:inline">Doraemon AI Lab</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-doraemon-light-blue hover:text-primary"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User area */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-doraemon-light-blue px-3 py-1.5 rounded-lg">
                <User size={12} />
                {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors px-2 py-1.5"
              >
                <LogOut size={12} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:shadow-md transition-all"
            >
              <LogIn size={12} /> Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-card px-4 pb-4 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-doraemon-light-blue"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border mt-2 pt-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary">
                  <User size={16} /> {currentUser?.name}
                </div>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-accent w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-primary"
              >
                <LogIn size={16} /> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
