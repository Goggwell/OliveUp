import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-[20px] w-[100px] rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-[20px] w-[50px] rounded-full" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-20 h-20" />
      </CardContent>
      <CardFooter>
        <Skeleton className="w-[60px] h-[20px] rounded-full" />
      </CardFooter>
    </Card>
  );
};
