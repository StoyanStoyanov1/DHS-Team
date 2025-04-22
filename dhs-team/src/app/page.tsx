import HeroSection from "@/components/HeroSection";
import CodeEditorAnimation from "@/components/codeAnimation/CodeEditorAnimation";
import SqlEditorAnimation from "@/components/codeAnimation/SqlEditorAnimation";
import FeaturesSection from "@/components/FeaturesSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
    return (
        <>
            <section className="container mx-auto px-4 pt-40">
                <div className="w-full mb-20 hero-reveal stagger-children text-center">
                    <HeroSection />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <div className="hero-reveal reveal-delay-2">
                        <CodeEditorAnimation />
                    </div>
                    <div className="hero-reveal reveal-delay-3">
                        <SqlEditorAnimation />
                    </div>
                </div>

                <div className="mb-20">
                    <FeaturesSection />
                </div>
            </section>

            <section id="contact" className="container mx-auto px-4 mb-20">
                <ContactSection />
            </section>
        </>
    );
}
