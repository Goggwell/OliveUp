export const runtime = "edge";
export const revalidate = 60;

export default async function Home() {
  return (
    <div className="flex h-fit items-center">
      <p>Hello</p>
    </div>
  );
}
