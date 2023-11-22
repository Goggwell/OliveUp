import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { $queryId } from "@/lib/store";
import Beasts from "@/components/beasts/Beasts";
import { MonsterResponse } from "@/lib/types";
import { dayInMS } from "@/lib/utils";

export const runtime = "edge";
export const revalidate = dayInMS;

export default async function BeastsPage() {
  const queryClient = new QueryClient();

  const getBeasts = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `https://hono-cassette-api.hono-beast-test.workers.dev/${$queryId.get()}?offset=${pageParam}`
    );
    const data: MonsterResponse = await res.json();
    return { ...data, prevOffset: pageParam };
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: [`getBeasts/${$queryId.get()}`],
    networkMode: "offlineFirst",
    queryFn: getBeasts,
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Beasts />
    </HydrationBoundary>
  );
}
