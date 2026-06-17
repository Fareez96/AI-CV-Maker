import CVOptimizer from "@/components/cv-optimizer";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">
      <Header />
      <CVOptimizer />
      <Footer />
    </main>
  );
}
