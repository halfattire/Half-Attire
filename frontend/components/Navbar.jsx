"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../lib/data";

function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex items-center gap-6 lg:gap-12">
        {navItems.map((item, index) => (
          <p key={index}>
            <Link
              href={item.url}
              className={
                pathname === item.url
                  ? "text-[#17dd1f] font-semibold"
                  : "text-white font-semibold"
              }
            >
              {item.title}
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
}

export default Navbar;