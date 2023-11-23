"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { $queryId } from "@/lib/store";
import { CardSkeleton } from "@/components/cardSkeleton";
import { CardImage } from "@/components/cardImage";
import { Monster } from "@/lib/types";
import { useStore } from "@nanostores/react";
import { useInView } from "react-intersection-observer";

export default function Beasts() {
  const [queryId, setQueryId] = useState<string>("");
  const { ref, inView } = useInView();

  const getBeasts = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `https://hono-cassette-api.hono-beast-test.workers.dev/${queryId}?offset=${pageParam}`
    );
    const data = await res.json();
    return { ...data, prevOffset: pageParam };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isPending,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [`getAllBeasts/${queryId}`],
    networkMode: "offlineFirst",
    queryFn: getBeasts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.prevOffset + 12 > 129) {
        return false;
      }

      return lastPage.prevOffset + 12;
    },
  });
  const beasts: Monster[] = data?.pages.reduce((acc, page) => {
    return [...acc, ...page.data];
  }, []);

  const storedQueryId = useStore($queryId);

  useEffect(() => {
    setQueryId(storedQueryId);
  }, [storedQueryId]);

  useEffect(() => {
    // add arr length conditional since it refetches query on refresh
    if (inView && beasts.length !== 129) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNextPage, inView]);

  return (
    <>
      <ul className="grid gap-4 min-[470px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-4">
        {(isLoading || isFetching || isRefetching || isPending) && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
        {beasts?.map((beast) => (
          <li key={beast.beastid} ref={beast.id === beasts.length ? ref : null}>
            <Link href={`/beasts/${beast.name}`} prefetch={false}>
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
                  <Badge
                    style={{ backgroundColor: `hsl(var(--${beast.type}))` }} // tailwind can't load dynamic classes
                  >
                    {beast.type}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
