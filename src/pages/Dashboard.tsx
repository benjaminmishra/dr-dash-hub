import { Button } from "@/components/ui/button";
import { TLDRCard, TLDRData } from "@/components/TLDRCard";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  ],
};

const topics = ["AI News", "Tech News", "Global Finance"];

const CreateNewsletterForm = ({ onSubscriptionCreated }: { onSubscriptionCreated: () => void }) => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [schedule, setSchedule] = useState("");
  const [summarization_prompt, setSummarizationPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-generator", {
        body: { topic, schedule, summarization_prompt },
      });

      if (error) {
        throw error;
      }

      toast({ title: "Subscription created", description: "Your newsletter subscription has been successfully created." });
      onSubscriptionCreated();
    } catch (error) {
      toast({ title: "Error creating subscription", description: "There was an error creating your subscription. Please try again.", variant: "destructive" });
      console.error("Failed to create subscription:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Latest advancements in AI" required />
      </div>
      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
        <Input id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="e.g., Every Monday at 9am" required />
      </div>
      <div>
        <label htmlFor="summarization_prompt" className="block text-sm font-medium text-gray-700">Summarization Style</label>
        <Textarea id="summarization_prompt" value={summarization_prompt} onChange={(e) => setSummarizationPrompt(e.target.value)} placeholder="e.g., Summarize as a bulleted list for a technical audience" />
      </div>
      <Button type="submit" disabled={isCreating}>
        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Subscription
      </Button>
    </form>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("AI News");
  const [tldrData, setTldrData] = useState<TLDRData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadTLDRs = async (topic: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTldrData(mockTLDRs[topic] || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTLDRs(selectedTopic);
  }, [selectedTopic]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-content-bg">
      <Navbar 
        isLoggedIn={true}
        userEmail={user?.email || ''}
        onLogout={handleLogout}
        onSettings={() => navigate('/settings')}
      />
      
      <div className="container px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Create Newsletter</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Newsletter Subscription</DialogTitle>
                </DialogHeader>
                <CreateNewsletterForm onSubscriptionCreated={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>

          </div>

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