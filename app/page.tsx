import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scarcity } from "@/components/Scarcity";
import { Timer } from "@/components/Timer";
import { Colors } from "@/components/Colors";
import { Product } from "@/components/Product";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Scarcity />
        <Timer />
        <Colors />
        <Product />
        <Reviews />
        <FAQ />
        <LeadForm />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
