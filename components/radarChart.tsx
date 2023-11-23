import { ResponsiveRadar } from "@nivo/radar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const RadarChart = ({ data }: { data: Record<string, unknown>[] }) => {
  return (
    <ResponsiveRadar
      data={data}
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
            <text className="font-medium text-sm fill-current">{id}</text>
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
  );
};
