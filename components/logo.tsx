"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const [reveal, setReveal] = useState(false);

  return (
    <>
      <Skeleton
        className={cn(
          "block h-14 w-28 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          reveal ? "hidden" : "visible"
        )}
      />
      <Image
        src="https://wiki.cassettebeasts.com/images/logo_270.png"
        alt="Logo"
        width={270}
        height={270}
        style={{
          objectFit: "cover",
          visibility: reveal ? "visible" : "hidden",
        }}
        onError={() => setReveal(true)}
        onLoad={() => setReveal(true)}
      />
    </>
  );
};
