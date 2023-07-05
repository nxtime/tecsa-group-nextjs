import UserLogs from "@/components/organisms/UserLogs";
import Header from "@/components/organisms/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-screen mx-auto max-w-5xl px-8 xl:px-0">
      <Header />
      <UserLogs />
    </div>
  );
}
