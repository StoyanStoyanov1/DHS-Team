import NavBar from "@/components/navigation/NavBar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
    return (
      <div className="min-h-screen bg-gradient-radial from-blue-50 to-transparent dark:from-gray-900 dark:to-gray-950">
        <NavBar />
        <main>
          <section className="container mx-auto px-4 pt-20">
            <div className="w-full mb-20 hero-reveal stagger-children text-center">
              <HeroSection />
            </div>
          {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">*/}
          {/*    <div className="hero-reveal reveal-delay-2">*/}
          {/*      <CodeEditorAnimation />*/}
          {/*    </div>*/}
          {/*    <div className="hero-reveal reveal-delay-3">*/}
          {/*      <SqlEditorAnimation />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="mb-20">*/}
          {/*    <FeaturesSection />*/}
          {/*  </div>*/}
          {/*</section>*/}
          {/*<section id="contact">*/}
          {/*  <ContactSection />*/}
          </section>
        </main>
        </div>
  );
}