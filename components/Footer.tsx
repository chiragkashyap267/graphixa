"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 sm:mt-40 text-slate-300">
      {/* AMBIENT AURORA GLOW */}
      <div
        className="
          absolute inset-x-0 -top-32 sm:-top-48 h-32 sm:h-48
          bg-[radial-gradient(circle,rgba(45,212,191,0.22),transparent_70%)]
          blur-[140px] sm:blur-[160px]
          pointer-events-none
        "
      />

      {/* GLASS FOOTER CONTAINER */}
      <div
        className="
          relative
          max-w-7xl mx-auto
          rounded-3xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          px-6 sm:px-8
          py-12 sm:py-20
        "
      >
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          {/* BRAND */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-[700] tracking-tight text-white mb-4">
              Graphi<span className="text-teal-400">XA</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/60 max-w-sm mx-auto sm:mx-0">
              Premium digital assets, mockups, and creative resources crafted
              for designers, developers, and modern creators.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4 sm:mb-5 tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Cart", href: "/cart" },
                { label: "My Account", href: "/account" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="
                      inline-block
                      text-white/60
                      hover:text-teal-300
                      transition-colors
                      relative
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[1px] after:w-0 after:bg-teal-400
                      hover:after:w-full after:transition-all
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4 sm:mb-5 tracking-tight">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="
                      inline-block
                      text-white/60
                      hover:text-teal-300
                      transition-colors
                      relative
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[1px] after:w-0 after:bg-teal-400
                      hover:after:w-full after:transition-all
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4 sm:mb-5 tracking-tight">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <span className="text-white/80">Email:</span>{" "}
                support@graphixa.com
              </li>
              <li>
                <span className="text-white/80">Location:</span> India
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          className="
            mt-10 sm:mt-14
            pt-5 sm:pt-6
            border-t border-white/10
            text-center text-xs sm:text-sm text-white/40
          "
        >
          © {new Date().getFullYear()}{" "}
          <span className="text-white/70">GraphiXA</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
