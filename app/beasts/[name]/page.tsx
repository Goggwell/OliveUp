import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SingleBeast from "@/components/beasts/SingleBeast";
import { Monster } from "@/lib/types";

export const runtime = "edge";
export const revalidate = 1000 * 60 * 60 * 24;

export default async function SingleBeastPage({
  params,
}: {
  params: { name: string };
}) {
  const queryClient = new QueryClient();

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  await queryClient.prefetchQuery({
    queryKey: [`getSingleBeast/${params.name}`],
    queryFn: async (arg) => {
      const cache = getFromCache(`getBeasts/${params.name}`);
      if (cache) return cache;

      const res = await fetch(
        `https://hono-cassette-api.hono-beast-test.workers.dev/api/${
          arg.queryKey[0].split("/")[1]
        }`
      );
      const resJson: { data: Monster[] } = await res.json();
      return resJson.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleBeast name={params.name} />
    </HydrationBoundary>
  );
}
