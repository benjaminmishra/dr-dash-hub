import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface TLDRData {
  id: string;
  topic: string;
  date: string;
  summary: string;
  sources?: string[];
}

interface TLDRCardProps {
  data: TLDRData;
}

export const TLDRCard = ({ data }: TLDRCardProps) => {
  const [showSources, setShowSources] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="mb-6 overflow-hidden border-0 shadow-card hover:shadow-elevated transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-sm font-medium text-primary">{data.topic}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDate(data.date)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed text-base">
            {data.summary}
          </p>
        </div>

        {data.sources && data.sources.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSources(!showSources)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <span>Sources ({data.sources.length})</span>
              {showSources ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showSources && (
              <div className="mt-3 space-y-2">
                {data.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary-glow transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{source}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};