import { RenterTabBar } from "@/components/site/renter-tab-bar";

export default function RenterLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="container-page flex-1 pt-6 pb-28 sm:pt-8 md:pb-16">{children}</main>
      <RenterTabBar />
    </>
  );
}
