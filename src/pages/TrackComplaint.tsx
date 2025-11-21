import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, CheckCircle2, AlertCircle, Eye, MapPin, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Mock complaint data for demonstration
  const mockComplaints: Record<string, any> = {
    "CT001": {
      id: "CT-2024-001",
      title: "Pothole on Main Street",
      description: "Large pothole causing traffic issues near intersection",
      category: "Roads & Infrastructure",
      location: "Main St & 5th Avenue, Downtown",
      priority: "High",
      status: "In Progress",
      reportedBy: "john.doe@email.com",
      reportedDate: "2024-01-15",
      assignedTo: "Roads Department",
      assignedDate: "2024-01-16",
      expectedResolution: "2024-01-22",
      updates: [
        { date: "2024-01-15", status: "Received", note: "Complaint received and logged" },
        { date: "2024-01-16", status: "Assigned", note: "Assigned to Roads Department for inspection" },
        { date: "2024-01-18", status: "In Progress", note: "Work crew dispatched, repair materials ordered" }
      ],
      photos: ["photo1.jpg", "photo2.jpg"]
    },
    "CT002": {
      id: "CT-2024-002",
      title: "Broken Street Light",
      description: "Street light not working for past week",
      category: "Utilities",
      location: "Park Avenue near Central Park",
      priority: "Medium",
      status: "Resolved",
      reportedBy: "jane.smith@email.com",
      reportedDate: "2024-01-10",
      assignedTo: "Electrical Department",
      assignedDate: "2024-01-11",
      resolvedDate: "2024-01-14",
      updates: [
        { date: "2024-01-10", status: "Received", note: "Complaint received and logged" },
        { date: "2024-01-11", status: "Assigned", note: "Assigned to Electrical Department" },
        { date: "2024-01-12", status: "In Progress", note: "Technician dispatched for inspection" },
        { date: "2024-01-14", status: "Resolved", note: "Street light repaired and tested" }
      ],
      photos: ["light1.jpg"]
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError("");
    setComplaint(null);

    try {
      // Use the public function to fetch complaint by tracking code
      const { data, error } = await supabase.rpc('get_complaint_public', {
        p_code: complaintId.toLowerCase()
      });

      if (error) {
        console.error('Search error:', error);
        setError("Error searching for complaint. Please try again.");
        toast({
          title: "Search Error",
          description: "There was an error searching for your complaint.",
          variant: "destructive"
        });
      } else if (data && data.length > 0) {
        const complaint = data[0];
        setComplaint({
          id: complaint.tracking_code.toUpperCase(),
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          location: complaint.location_address || "Not specified",
          priority: complaint.priority,
          status: complaint.status,
          reportedBy: "Citizen",
          reportedDate: new Date(complaint.created_at).toLocaleDateString(),
          assignedTo: "Municipal Department",
          updates: [
            { 
              date: new Date(complaint.created_at).toLocaleDateString(), 
              status: "Received", 
              note: "Complaint received and logged" 
            },
            ...(complaint.status !== "received" ? [{
              date: new Date(complaint.updated_at).toLocaleDateString(),
              status: complaint.status,
              note: `Status updated to ${complaint.status}`
            }] : [])
          ],
          photos: complaint.photos || []
        });
        toast({
          title: "Complaint Found",
          description: `Complaint ${complaint.tracking_code.toUpperCase()} details loaded successfully.`
        });
      } else {
        setError("Invalid Complaint ID. Please check and try again.");
        toast({
          title: "Complaint Not Found",
          description: "Please verify your Complaint ID and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred while searching.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Received":
        return <AlertCircle className="w-4 h-4" />;
      case "Assigned":
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Complaint</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your Complaint ID to check the current status and updates
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <span>Enter Complaint ID</span>
              </CardTitle>
              <CardDescription>
                Enter the tracking code you received when submitting your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaintId">Complaint ID</Label>
                  <Input
                    id="complaintId"
                    placeholder="e.g., A1B2C3D4"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    className="text-center font-mono"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button 
                  onClick={handleSearch}
                  className="w-full"
                  disabled={!complaintId.trim() || isSearching}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Track Complaint"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaint Details */}
        {complaint && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main Details Card */}
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{complaint.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {complaint.id}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {complaint.reportedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(complaint.status)}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority} Priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{complaint.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-muted-foreground flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {complaint.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Category</h4>
                    <p className="text-muted-foreground">{complaint.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Assigned To</h4>
                    <p className="text-muted-foreground flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {complaint.assignedTo}
                    </p>
                  </div>
                  {complaint.expectedResolution && (
                    <div>
                      <h4 className="font-semibold mb-1">Expected Resolution</h4>
                      <p className="text-muted-foreground">{complaint.expectedResolution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
                <CardDescription>
                  Track the progress of your complaint from submission to resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaint.updates.map((update: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(update.status)}`}>
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{update.status}</span>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{update.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photos Section */}
            {complaint.photos && complaint.photos.length > 0 && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Attached Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {complaint.photos.map((photo: string, index: number) => (
                      <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Photo {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;