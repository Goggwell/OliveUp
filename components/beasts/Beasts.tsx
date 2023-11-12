"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/themeToggle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
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
import { $beasts, $queryId } from "@/lib/store";
import { CardSkeleton } from "@/components/cardSkeleton";
import { CardImage } from "@/components/cardImage";
import { Logo } from "@/components/logo";
import { Monster } from "@/lib/types";

export default function Beasts() {
  const queryClient = useQueryClient();
  const [queryId, setQueryId] = useState<string>("");

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  const { data, isLoading, isFetching, isPending, isRefetching } = useQuery(
    {
      queryKey: [`getBeasts/${queryId}`],
      staleTime: 3600,
      networkMode: "offlineFirst",
      queryFn: async (arg) => {
        const cache = getFromCache(`getBeasts/${queryId}`);
        if (cache) {
          $beasts.set(cache);
          return cache;
        }

        const res = await fetch(
          `https://hono-cassette-api.hono-beast-test.workers.dev/${
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

  const onQueryChange = useMemo(
    () =>
      debounce(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        $queryId.set(value || "");
        setQueryId($queryId.get());
      }, 300),
    []
  );

  return (
    <main className="relative mx-auto my-0 w-full max-w-7xl flex flex-col px-4">
      <div className="flex h-fit items-center justify-between">
        <div>
          <Link href="/" className="h-28 w-28 relative grid place-items-center">
            <Logo />
          </Link>
        </div>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Search..."
            className="w-[100px] md:w-[200px] lg:w-[300px]"
            onChange={onQueryChange}
          />
          <ThemeToggle />
        </div>
      </div>
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
            <Card>
              <CardHeader>
                <CardTitle>{beast.name}</CardTitle>
                <CardDescription>#{beast.beastid}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-20 h-20 grid items-center relative">
                  <CardImage src={beast.images!.animated!} alt={beast.name!} />
                </div>
              </CardContent>
              <CardFooter>
                <Badge>{beast.type}</Badge>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
