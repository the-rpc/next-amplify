import HelloWorld from "./components/HelloWorld";
import ServerTime from "./components/ServerTime";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HelloWorld>
        <ServerTime />
      </HelloWorld>
    </main>
  );
}
