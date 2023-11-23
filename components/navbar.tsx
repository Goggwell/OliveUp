"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Search } from "@/components/search";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/themeToggle";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-fit items-center justify-between">
      <div>
        <Link href="/" className="h-28 w-28 relative grid place-items-center">
          <Logo />
        </Link>
      </div>
      <div className="flex gap-4">
        {/* exact match so we don't target nested routes */}
        {pathname.match(/^\/beasts$/i) && <Search />}
        <ThemeToggle />
      </div>
    </div>
  );
};
