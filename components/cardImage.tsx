"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const CardImage = ({ src, alt }: { src: string; alt: string }) => {
  const [reveal, setReveal] = useState(false);

  return (
    <>
      <Skeleton
        className={cn(
          "block h-14 w-14 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          reveal ? "hidden" : "visible"
        )}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="33vw"
        style={{
          objectFit: "contain",
          imageRendering: "pixelated",
          visibility: reveal ? "visible" : "hidden",
          transform: reveal ? "none" : "scale(0)",
        }}
        onError={() => setReveal(true)}
        onLoad={() => setReveal(true)}
      />
    </>
  );
};
