import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { $queryId, $beasts } from "@/lib/store";
import Beasts from "@/components/beasts/Beasts";

export const runtime = "edge";

export default async function Home() {
  const queryClient = new QueryClient();

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  await queryClient.prefetchQuery({
    queryKey: [`getBeasts/${$queryId.get()}`],
    staleTime: 3600,
    queryFn: async (arg) => {
      const cache = getFromCache(`getBeasts/${$queryId.get()}`);
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
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Beasts />
    </HydrationBoundary>
  );
}
