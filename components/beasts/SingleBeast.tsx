"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/themeToggle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/cardSkeleton";
import { CardImage } from "@/components/cardImage";
import { Logo } from "@/components/logo";
import { Monster } from "@/lib/types";

export default function SingleBeast({ name }: { name: string }) {
  const queryClient = useQueryClient();

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  const { data, isLoading, isFetching, isPending, isRefetching } = useQuery(
    {
      queryKey: [`getSingleBeast/${name}`],
      networkMode: "offlineFirst",
      queryFn: async (arg) => {
        const cache = getFromCache(`getSingleBeast/${name}`);
        if (cache) return cache;

        const res = await fetch(
          `https://hono-cassette-api.hono-beast-test.workers.dev/${
            arg.queryKey[0].split("/")[1]
          }`
        );
        const resJson = await res.json();
        return resJson.data;
      },
    },
    queryClient
  );

  const fetchedData: Monster = data[0];

  return (
    <h1>
      <span>{fetchedData?.name}</span>
    </h1>
  );
}
