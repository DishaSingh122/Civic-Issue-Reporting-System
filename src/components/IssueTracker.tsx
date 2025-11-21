import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";

const IssueTracker = () => {
  // Demo data for issues
  const issues = [
    {
      id: "CR-2024-001",
      title: "Broken chairs in Classroom 301",
      category: "Infrastructure",
      status: "in-progress",
      location: "Main Building, Classroom 301",
      reportedDate: "2024-01-15",
      lastUpdate: "2024-01-18",
      urgency: "high"
    },
    {
      id: "CR-2024-002",
      title: "Missing textbooks in Library",
      category: "Study Material",
      status: "resolved",
      location: "Central Library, CS Section",
      reportedDate: "2024-01-12",
      lastUpdate: "2024-01-17",
      urgency: "medium"
    },
    {
      id: "CR-2024-003",
      title: "Poor audio system in Auditorium",
      category: "Infrastructure",
      status: "received",
      location: "Main Auditorium",
      reportedDate: "2024-01-18",
      lastUpdate: "2024-01-18",
      urgency: "low"
    },
    {
      id: "CR-2024-004",
      title: "Unclean washrooms in Block B",
      category: "Cleaning & Maintenance",
      status: "in-progress",
      location: "Block B, Ground Floor",
      reportedDate: "2024-01-16",
      lastUpdate: "2024-01-19",
      urgency: "urgent"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Circle className="w-4 h-4 text-status-received" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-status-progress" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-status-resolved" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "received": { label: "Received", className: "bg-status-received/20 text-status-received hover:bg-status-received/30" },
      "in-progress": { label: "In Progress", className: "bg-status-progress/20 text-status-progress hover:bg-status-progress/30" },
      "resolved": { label: "Resolved", className: "bg-status-resolved/20 text-status-resolved hover:bg-status-resolved/30" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      "low": { label: "Low", className: "bg-muted text-muted-foreground" },
      "medium": { label: "Medium", className: "bg-status-progress/20 text-status-progress" },
      "high": { label: "High", className: "bg-amber-500/20 text-amber-700" },
      "urgent": { label: "Urgent", className: "bg-status-urgent/20 text-status-urgent" }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || { label: urgency, className: "" };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <section id="track" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Reported Issues</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor the progress of campus issues reported by students and stay updated on resolutions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, title, or location..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filter by Status
            </Button>
          </div>
        </div>

        {/* Issues List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {issues.map((issue) => (
            <Card key={issue.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(issue.status)}
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {issue.id}
                      </span>
                      <span>•</span>
                      <span>{issue.category}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(issue.status)}
                    {getUrgencyBadge(issue.urgency)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Reported {issue.reportedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      Last update: {issue.lastUpdate}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Issues
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IssueTracker;