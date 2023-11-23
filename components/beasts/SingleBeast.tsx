"use client";

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
import { getFromCache } from "@/lib/utils";

export default function SingleBeast({ name }: { name: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isPending, isRefetching } = useQuery(
    {
      queryKey: [`getSingleBeast/${name}`],
      networkMode: "offlineFirst",
      queryFn: async (arg) => {
        const cache = getFromCache(`getSingleBeast/${name}`, queryClient);
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
    <section className="w-full h-full flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl tracking-tight font-semibold">
          {fetchedData.name}
          {/* <span className="text-base md:text-lg opacity-50 font-normal tracking-normal">
            #{fetchedData.beastid}
          </span> */}
        </h1>
        <div className="flex gap-1">
          <Badge>{fetchedData.type}</Badge>
        </div>
      </div>
      <div>
        <section className="w-full grid min-[470px]:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="relative py-4">
            <div className="w-full h-full min-h-[5rem] min-w-[5rem] grid items-center relative">
              <CardImage
                src={fetchedData.images!.animated!}
                alt={fetchedData.name!}
              />
            </div>
          </Card>
          <Card className="md:col-span-2 md:row-span-2"></Card>
          <Card>
            <CardContent className="pt-6">
              <p>{fetchedData.description}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}
