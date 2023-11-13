import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { links } from "@/lib/links";
import Link from "next/link";

export const runtime = "edge";
export const revalidate = 60;

export default async function Home() {
  return (
    <ul className="grid gap-4 min-[470px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {links.map((link) => (
        <li key={link.url}>
          <Link href={link.url}>
            <Card className="relative overflow-clip auto-rows-fr h-full hover:border-indigo-600 hover:bg-indigo-600 hover:bg-opacity-30 hover:scale-105 transition">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="bg-gradient-to-r from-purple-500 to-teal-500 w-fit text-transparent bg-clip-text pb-[1px]">
                    {link.url}
                  </CardTitle>
                </div>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
