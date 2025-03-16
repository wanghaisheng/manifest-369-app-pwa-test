"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Icons for navigation
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const WishesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PracticeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [currentTime] = useState("9:41");

  return (
    <div className="iphone-frame">
      {/* iOS Status Bar */}
      <div className="status-bar">
        <div className="status-bar-time">{currentTime}</div>
        <div className="status-bar-icons">
          <span className="text-xs">●●●●●</span>
        </div>
      </div>

      <div className="app-container">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-purple-700">369 Manifestation</h1>
          </div>
        </header>

        <main className="p-4 overflow-y-auto flex-1">{children}</main>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <NavItem
            href="/"
            icon={<HomeIcon />}
            label="Home"
            isActive={pathname === "/"}
          />
          <NavItem
            href="/wishes"
            icon={<WishesIcon />}
            label="Wishes"
            isActive={pathname === "/wishes"}
          />
          <NavItem
            href="/practice"
            icon={<PracticeIcon />}
            label="Practice"
            isActive={pathname === "/practice"}
          />
          <NavItem
            href="/profile"
            icon={<ProfileIcon />}
            label="Profile"
            isActive={pathname === "/profile"}
          />
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`bottom-nav-item ${isActive ? "active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
