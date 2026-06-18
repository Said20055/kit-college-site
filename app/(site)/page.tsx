import { getCollege } from "@/lib/data/college";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Specialties } from "@/components/sections/Specialties";
import { Advantages } from "@/components/sections/Advantages";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { CtaBand } from "@/components/sections/CtaBand";

export default async function Home() {
  const college = await getCollege();

  return (
    <>
      <Hero shortName={college.shortName} tagline={college.tagline} />
      <Stats />
      <Specialties />
      <Advantages />
      <NewsPreview />
      <CtaBand />
    </>
  );
}
