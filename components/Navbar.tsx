"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@mui/material/Button";
import { useCart } from "./CartContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const user = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BACKDROP DIM FOR MOBILE MENU */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <header className="fixed top-3 md:top-6 left-0 right-0 z-50 px-3 md:px-6">
        {/* FLOATING GLASS NAVBAR */}
        <div
          className="
            relative
            max-w-7xl mx-auto
            rounded-2xl
            bg-black/40
            backdrop-blur-xl
            border border-white/20
            shadow-lg shadow-black/40
            px-6 h-16
            flex items-center
          "
        >
          {/* TOP NEON EDGE */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

          {/* CONTENT */}
          <div className="relative w-full flex items-center justify-between">
            {/* LOGO */}
            <Link
              href="/"
              className="
                relative
                text-2xl md:text-3xl
                font-extrabold
                tracking-tight
                uppercase
                text-white
                select-none
              "
            >
              <span className="relative z-10">
                Graphi
                <span className="text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]">
                  XA
                </span>
              </span>

              <span className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-teal-400/40 to-emerald-400/40 -z-10" />
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="
                md:hidden
                text-white
                p-2
                rounded-lg
                bg-white/10
                border border-white/20
                hover:border-teal-400/60
                transition
              "
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink href="/cart">
                Cart
                {cart.length > 0 && (
                  <span className="ml-1 text-teal-400">({cart.length})</span>
                )}
              </NavLink>

              {!user ? (
                <>
                  <NavLink href="/login">Login</NavLink>
                  <NavLink href="/signup">Sign Up</NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/account">My Account</NavLink>
                  <button
                    onClick={() => signOut(auth)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}

              <Button
                component={Link}
                href="/admin/login"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#2dd4bf",
                  color: "#2dd4bf",
                  "&:hover": {
                    borderColor: "#5eead4",
                    backgroundColor: "rgba(45,212,191,0.1)",
                  },
                }}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {open && (
          <div
            className="
              md:hidden
              mt-3
              mx-auto
              max-w-7xl
              rounded-2xl
              bg-black/60
              backdrop-blur-xl
              border border-white/20
              shadow-xl shadow-black/50
              p-6
              space-y-5
            "
          >
            <MobileNavLink href="/cart" onClick={() => setOpen(false)}>
              Cart {cart.length > 0 && `(${cart.length})`}
            </MobileNavLink>

            {!user ? (
              <>
                <MobileNavLink href="/login" onClick={() => setOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink href="/signup" onClick={() => setOpen(false)}>
                  Sign Up
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink href="/account" onClick={() => setOpen(false)}>
                  My Account
                </MobileNavLink>

                <button
                  onClick={() => {
                    signOut(auth);
                    setOpen(false);
                  }}
                  className="w-full text-left text-red-400 py-2 text-lg"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="
                block
                text-center
                py-3
                rounded-xl
                border border-teal-400
                text-teal-300
                text-lg
              "
            >
              Admin
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

/* ------------------ */
/* DESKTOP NAV LINK */
/* ------------------ */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        relative
        text-white/70
        hover:text-teal-300
        transition-colors
        after:absolute
        after:left-0
        after:-bottom-1
        after:h-[2px]
        after:w-0
        after:bg-teal-400
        after:transition-all
        hover:after:w-full
      "
    >
      {children}
    </Link>
  );
}

/* ------------------ */
/* MOBILE NAV LINK */
/* ------------------ */
function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        block
        w-full
        py-3
        text-lg
        font-medium
        text-white
        hover:text-teal-300
        transition
      "
    >
      {children}
    </Link>
  );
}
