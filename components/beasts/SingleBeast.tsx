"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardImage } from "@/components/cardImage";
import { Monster, ParsedBaseStats } from "@/lib/types";
import { getFromCache } from "@/lib/utils";
import { ResponsiveRadar } from "@nivo/radar";

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

  const fetchedData: Monster = data[0];
  const baseStatKeys = Object.keys(fetchedData.base_stats!);
  const baseStatValues = Object.values(fetchedData.base_stats!);
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
          {fetchedData.name}
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
          <Card className="md:col-span-2 md:row-span-2">
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full max-h-[300px]">
              <ResponsiveRadar
                data={baseStats}
                keys={["stat"]}
                indexBy="stat_name"
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                gridShape="linear"
                maxValue={255}
                borderWidth={0}
                gridLabelOffset={10}
                colors={{ scheme: "pastel1" }}
                theme={{
                  grid: {
                    line: {
                      opacity: 0.2,
                    },
                  },
                }}
                fillOpacity={0.45}
                enableDots={false}
                motionConfig="wobbly"
                gridLabel={({ id, x, y, anchor, angle }) => (
                  <g transform={`translate(${x}, ${y})`}>
                    <g
                      transform={`translate(${
                        anchor === "end" ? -40 : anchor === "middle" ? -20 : 0
                      }, ${angle === 90 ? 10 : angle === -90 ? 0 : 5})`}
                    >
                      <text className="font-medium text-sm fill-current">
                        {id}
                      </text>
                    </g>
                  </g>
                )}
                sliceTooltip={({ index, data }) => (
                  <Card className="p-0">
                    <CardHeader className="p-2 pb-0">
                      <CardTitle className="text-lg">{index}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                      {data.map((datum) => [datum.formattedValue])}
                    </CardContent>
                  </Card>
                )}
              />
            </CardContent>
          </Card>
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
