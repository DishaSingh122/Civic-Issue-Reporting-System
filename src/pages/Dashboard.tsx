import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Circle,
  Users,
  TrendingUp,
  Calendar,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location_address: string | null;
  photos: string[] | null;
  videos: string[] | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const Dashboard = () => {
  const { user, isStaff, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      if (!isStaff) {
        navigate("/");
        return;
      }
      fetchComplaints();
    }
  }, [user, isStaff, loading, navigate]);

  const fetchComplaints = async () => {
    try {
      let query = supabase
        .from('complaints')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter as any);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching complaints:', error);
        toast({
          title: "Error",
          description: "Failed to fetch complaints",
          variant: "destructive",
        });
        return;
      }

      setComplaints((data || []) as any);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
      
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId);

      if (error) {
        console.error('Error updating complaint:', error);
        toast({
          title: "Error",
          description: "Failed to update complaint status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status Updated",
        description: `Complaint status updated to ${newStatus}`,
      });
      
      fetchComplaints();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Circle className="w-4 h-4 text-blue-500" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "received": { label: "Received", className: "bg-blue-100 text-blue-800" },
      "in_progress": { label: "In Progress", className: "bg-yellow-100 text-yellow-800" },
      "resolved": { label: "Resolved", className: "bg-green-100 text-green-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      "low": { label: "Low", className: "bg-gray-100 text-gray-800" },
      "medium": { label: "Medium", className: "bg-blue-100 text-blue-800" },
      "high": { label: "High", className: "bg-orange-100 text-orange-800" },
      "urgent": { label: "Urgent", className: "bg-red-100 text-red-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || { label: priority, className: "" };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.location_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: complaints.length,
    received: complaints.filter(c => c.status === 'received').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Staff Dashboard</h1>
              <p className="text-muted-foreground">Manage civic complaints and issues</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Reports</CardTitle>
              <Circle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.received}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search complaints..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchComplaints} variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complaint.status)}
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          {complaint.id.slice(0, 8)}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{complaint.category}</span>
                        <span>•</span>
                        <span>By {complaint.profiles?.full_name || 'Anonymous'}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(complaint.status)}
                    {getPriorityBadge(complaint.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{complaint.description}</p>
                  
                  {complaint.location_address && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{complaint.location_address}</span>
                    </div>
                  )}

                  {((complaint.photos && complaint.photos.length > 0) || (complaint.videos && complaint.videos.length > 0)) && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Attached Media:</p>
                      <div className="flex flex-wrap gap-2">
                        {complaint.photos && complaint.photos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Complaint photo ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => window.open(photo, '_blank')}
                          />
                        ))}
                        {complaint.videos && complaint.videos.map((video, index) => (
                          <video 
                            key={index}
                            src={video} 
                            className="w-20 h-20 object-cover rounded border cursor-pointer"
                            controls
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Reported {new Date(complaint.created_at).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>Updated {new Date(complaint.updated_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {complaint.status === 'received' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                        >
                          Start Progress
                        </Button>
                      )}
                      {complaint.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      {complaint.status === 'resolved' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No complaints found</p>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;