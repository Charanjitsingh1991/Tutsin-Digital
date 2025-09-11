import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Pricing } from "@/components/sections/Pricing";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Pricing />
      <BlogPreview />
      <Contact />
    </div>
  );
}
