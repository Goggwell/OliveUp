"use client";

import Link from "next/link";
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
import { $beasts, $queryId } from "@/lib/store";
import { CardSkeleton } from "@/components/cardSkeleton";
import { CardImage } from "@/components/cardImage";
import { Monster } from "@/lib/types";
import { useStore } from "@nanostores/react";

export default function Beasts() {
  const queryClient = useQueryClient();
  const [queryId, setQueryId] = useState<string>("");

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  const { data, isLoading, isFetching, isPending, isRefetching } = useQuery(
    {
      queryKey: [`getBeasts/${queryId}`],
      networkMode: "offlineFirst",
      queryFn: async (arg) => {
        const cache = getFromCache(`getBeasts/${queryId}`);
        if (cache) {
          $beasts.set(cache);
          return cache;
        }

        const res = await fetch(
          `https://hono-cassette-api.hono-beast-test.workers.dev/api/${
            arg.queryKey[0].split("/")[1]
          }`
        );
        const resJson = await res.json();
        $beasts.set(resJson.data);
        return resJson.data;
      },
    },
    queryClient
  );

  const storedQueryId = useStore($queryId);

  useEffect(() => {
    setQueryId(storedQueryId);
  }, [storedQueryId]);

  return (
    <>
      <ul className="grid gap-4 min-[470px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(isLoading || isFetching || isRefetching || isPending) && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
        {data?.map((beast: Monster) => (
          <li key={beast.beastid}>
            <Link href={`/beasts/${beast.name}`}>
              <Card className="hover:border-indigo-600 hover:bg-indigo-600 hover:bg-opacity-30 hover:scale-105 transition">
                <CardHeader>
                  <CardTitle>{beast.name}</CardTitle>
                  <CardDescription>#{beast.beastid}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-20 h-20 grid items-center relative">
                    <CardImage
                      src={beast.images!.animated!}
                      alt={beast.name!}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Badge>{beast.type}</Badge>
                </CardFooter>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
