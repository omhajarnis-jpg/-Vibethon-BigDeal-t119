import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, HelpCircle, Gamepad2, AlertTriangle, LayoutDashboard, Menu, X, Code2, FlaskConical, Trophy, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
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
    <nav className="sticky top-0 z-50 bg-[#E6F7FF]/90 backdrop-blur-md border-b-4 border-primary/20 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <img src={doraemonImg} alt="Doraemon" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform drop-shadow-sm" />
          <span className="font-heading font-black text-xl text-primary hidden sm:inline tracking-tight">AI Learning Lab</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm transform -translate-y-0.5"
                    : "text-primary/70 hover:bg-white hover:text-primary hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                <item.icon size={14} className={active ? "animate-bounce" : ""} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User area */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-primary/10">
                <User size={12} />
                {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-destructive hover:bg-destructive hover:text-white transition-colors px-3 py-1.5 rounded-2xl shadow-sm bg-white border border-destructive/20"
              >
                <LogOut size={12} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-black bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl shadow-md hover:-translate-y-0.5 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-secondary/50"
            >
              <LogIn size={14} /> Log In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 rounded-xl bg-white shadow-sm text-primary" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="lg:hidden border-t-2 border-primary/10 bg-[#E6F7FF] px-4 pb-4 shadow-inner"
        >
          <div className="flex flex-col gap-1 mt-3">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    active
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "bg-white text-primary hover:bg-primary/10"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t-2 border-primary/10 mt-3 pt-3">
            {isLoggedIn ? (
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-primary/10">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border text-sm font-black text-primary">
                  <User size={16} /> Hello, {currentUser?.name}!
                </div>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 p-2 rounded-xl text-sm font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-white w-full transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-secondary text-secondary-foreground shadow-md w-full"
              >
                <LogIn size={18} /> Log In to Track Progress
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
