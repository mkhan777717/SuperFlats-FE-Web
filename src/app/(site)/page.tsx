import { Hero } from "@/components/landing/hero";
import { BrowseByType, FinalCta, ForOwners, HowItWorks } from "@/components/landing/sections";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <BrowseByType />
      <ForOwners />
      <FinalCta />
    </main>
  );
}
