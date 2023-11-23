"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Search } from "@/components/search";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/themeToggle";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-fit items-center justify-between py-6">
      <div>
        <Link href="/">
          <h1 className="tracking-tight text-3xl font-semibold bg-gradient-to-r from-purple-500 to-teal-500 w-fit text-transparent bg-clip-text">
            oliveup
          </h1>
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
