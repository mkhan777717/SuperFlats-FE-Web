import { Hero } from "@/components/landing/hero";
import { FinalCta, ForOwners, HowItWorks } from "@/components/landing/sections";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ForOwners />
      <FinalCta />
    </main>
  );
}
