import { Button } from "@/components/ui/button";
import { TLDRCard, TLDRData } from "@/components/TLDRCard";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
  onSettings: () => void;
}

// Mock data for demonstration
const mockTLDRs: Record<string, TLDRData[]> = {
  "AI News": [
    {
      id: "ai-1",
      topic: "AI News",
      date: "2025-01-23T08:00:00Z",
      summary: "OpenAI announced GPT-5 with breakthrough reasoning capabilities, achieving 95% accuracy on complex logical problems. The model features enhanced mathematical reasoning and can now handle multi-step problem solving with unprecedented precision. Early beta users report significant improvements in code generation and scientific analysis tasks.",
      sources: [
        "https://openai.com/blog/gpt-5-announcement",
        "https://techcrunch.com/openai-gpt5-breakthrough",
        "https://arxiv.org/abs/2025.12345"
      ]
    },
    {
      id: "ai-2",
      topic: "AI News", 
      date: "2025-01-22T08:00:00Z",
      summary: "Google DeepMind's new Gemini Ultra model achieved human-level performance on the International Mathematical Olympiad, correctly solving 4 out of 6 problems. This represents a major milestone in AI mathematical reasoning. The model uses a novel approach combining transformer architecture with symbolic reasoning capabilities.",
      sources: [
        "https://deepmind.google/discover/blog/gemini-ultra-mathematics",
        "https://nature.com/articles/deepmind-mathematics-2025"
      ]
    },
    {
      id: "ai-3", 
      topic: "AI News",
      date: "2025-01-21T08:00:00Z",
      summary: "Microsoft Azure AI services expanded to 15 new regions globally, making advanced AI tools more accessible to developers worldwide. The expansion includes new GPU clusters optimized for large language model inference, reducing costs by up to 40% for enterprise customers. New regions span across Asia-Pacific, Europe, and South America.",
      sources: [
        "https://azure.microsoft.com/en-us/blog/ai-expansion",
        "https://microsoft.com/ai-global-infrastructure"
      ]
    }
  ],
  "Tech News": [
    {
      id: "tech-1",
      topic: "Tech News",
      date: "2025-01-23T08:00:00Z", 
      summary: "Apple unveiled its new M4 Ultra chip with 40-core CPU and 80-core GPU, setting new benchmarks for creative workloads. The chip features 50% better performance per watt compared to M3 Ultra, with enhanced neural engine capabilities for on-device AI processing. New Mac Pro and Mac Studio models featuring M4 Ultra will ship in March.",
      sources: [
        "https://apple.com/newsroom/m4-ultra-announcement",
        "https://anandtech.com/apple-m4-ultra-review"
      ]
    },
    {
      id: "tech-2",
      topic: "Tech News",
      date: "2025-01-22T08:00:00Z",
      summary: "Tesla's Full Self-Driving beta achieved 99.9% safety milestone in urban environments during Q4 2024 testing. The system successfully navigated complex intersections, construction zones, and emergency vehicle interactions with minimal human interventions. Regulatory approval for fully autonomous operation is expected in California and Texas by summer 2025.",
      sources: [
        "https://tesla.com/blog/fsd-safety-milestone",
        "https://electrek.co/tesla-fsd-99-safety"
      ]
    }
  ],
  "Global Finance": [
    {
      id: "finance-1", 
      topic: "Global Finance",
      date: "2025-01-23T08:00:00Z",
      summary: "Bitcoin reached a new all-time high of $180,000 following institutional adoption announcements from three major sovereign wealth funds. Norway's Government Pension Fund, Singapore's GIC, and Australia's Future Fund collectively allocated $50 billion to cryptocurrency holdings. The moves signal growing acceptance of digital assets in traditional portfolio management.",
      sources: [
        "https://coindesk.com/bitcoin-180k-institutional-adoption",
        "https://bloomberg.com/news/sovereign-funds-crypto"
      ]
    },
    {
      id: "finance-2",
      topic: "Global Finance", 
      date: "2025-01-22T08:00:00Z",
      summary: "Federal Reserve maintained interest rates at 4.75-5.00% range, citing stabilizing inflation trends and robust employment data. Chair Powell indicated potential rate cuts in Q3 2025 if inflation continues trending toward 2% target. Markets rallied on dovish signals, with S&P 500 gaining 2.1% in after-hours trading.",
      sources: [
        "https://federalreserve.gov/newsevents/pressreleases",
        "https://wsj.com/articles/fed-holds-rates-signals-cuts"
      ]
    }
  ]
};

const topics = ["AI News", "Tech News", "Global Finance"];

export const Dashboard = ({ userEmail, onLogout, onSettings }: DashboardProps) => {
  const [selectedTopic, setSelectedTopic] = useState("AI News");
  const [tldrData, setTldrData] = useState<TLDRData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTLDRs = async (topic: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setTldrData(mockTLDRs[topic] || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTLDRs(selectedTopic);
  }, [selectedTopic]);

  return (
    <div className="min-h-screen bg-content-bg">
      <Navbar 
        isLoggedIn={true}
        userEmail={userEmail}
        onLogout={onLogout}
        onSettings={onSettings}
      />
      
      <div className="container px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Topic Selector */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Topics</h2>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "topic-active" : "topic"}
                    className="w-full justify-start text-left h-12"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-medium text-foreground mb-2">Daily Summary</h3>
              <p className="text-sm text-muted-foreground">
                You've read {tldrData.length} summaries today. Keep up the great work staying informed!
              </p>
            </div>
          </div>

          {/* TLDR Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">{selectedTopic}</h1>
              <div className="text-sm text-muted-foreground">
                Latest updates
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading latest summaries...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {tldrData.map((tldr) => (
                  <TLDRCard key={tldr.id} data={tldr} />
                ))}
                
                {tldrData.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">
                      No summaries available for this topic yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};