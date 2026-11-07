import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { WorkflowSteps } from "@/components/WorkflowSteps";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5">
        <Hero />
        <LeadForm />
        <WorkflowSteps />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
