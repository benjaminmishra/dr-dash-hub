import { Button } from "@/components/ui/button";
import { TLDRCard } from "@/components/TLDRCard";
import { Navbar } from "@/components/Navbar";
import { Clock, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface LandingProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export const Landing = ({ onSignUp, onLogin }: LandingProps) => {
  // Example TLDR for demonstration
  const exampleTLDR = {
    id: "example-1",
    topic: "AI News",
    date: "2025-01-23T08:00:00Z",
    summary: "OpenAI announced GPT-5 with breakthrough reasoning capabilities, while Google DeepMind's new Gemini Ultra model achieved human-level performance on complex mathematical problems. Meanwhile, Microsoft Azure AI services expanded to 15 new regions globally, making advanced AI tools more accessible to developers worldwide.",
    sources: [
      "https://openai.com/blog/gpt-5-announcement",
      "https://deepmind.google/discover/blog/gemini-ultra-mathematics",
      "https://azure.microsoft.com/en-us/blog/ai-expansion"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSignUp={onSignUp} onLogin={onLogin} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/10"></div>
        <div className="container relative px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Your Daily News,{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Summarized
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Get the essence of tech, AI, and world news in under 5 minutes a day. 
                  Stay informed without the information overload.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" onClick={onSignUp} className="text-lg px-8 py-6">
                  Get Started for Free
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  See Example
                </Button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">5 min daily reads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">AI-powered summaries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Curated topics</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="News summarization concept"
                className="rounded-2xl shadow-elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-16 bg-content-bg">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                See What You'll Get
              </h2>
              <p className="text-lg text-muted-foreground">
                Here's an example of how we transform complex news into digestible insights
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <TLDRCard data={exampleTLDR} />
            </div>

            <div className="text-center mt-12">
              <Button variant="hero" size="lg" onClick={onSignUp} className="text-lg px-8 py-6">
                Start Reading Smarter Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-6">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 TLDR News. Built for busy professionals who want to stay informed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};