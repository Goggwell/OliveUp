"use client";

import dynamic from "next/dynamic";
import { getFromCache } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CardImage } from "@/components/cardImage";
import { Monster, ParsedBaseStats } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RadarChart = dynamic(
  () => import("@/components/radarChart").then((mod) => mod.RadarChart),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function SingleBeast({ name }: { name: string }) {
  const queryClient = useQueryClient();

  const { data } = useQuery(
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

  const beast: Monster = data[0];
  const baseStatKeys = Object.keys(beast.base_stats!);
  const baseStatValues = Object.values(beast.base_stats!);
  let baseStats: ParsedBaseStats = [];
  baseStatKeys.forEach((key, i) => {
    const baseStatValue = {
      stat_name: key,
      stat: baseStatValues[i],
    };
    baseStats.push(baseStatValue);
  });

  return (
    <section className="w-full h-full flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl tracking-tight font-semibold">
          {beast.name}
        </h1>
        <div className="flex gap-1">
          <Badge style={{ backgroundColor: `hsl(var(--${beast.type}))` }}>
            {beast.type}
          </Badge>
        </div>
      </div>
      <div>
        <section className="w-full grid md:grid-cols-3 gap-4">
          <Card className="relative py-4">
            <div className="w-full h-full min-h-[5rem] min-w-[5rem] grid items-center relative">
              <CardImage src={beast.images!.animated!} alt={beast.name!} />
            </div>
          </Card>
          <Card className="md:col-span-2 md:row-span-2">
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full max-h-[300px] max-w-[400px]">
              <RadarChart data={baseStats} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p>{beast.description}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}
