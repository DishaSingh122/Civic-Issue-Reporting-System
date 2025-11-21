import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Search,
  LogOut,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Edit3,
  MapPin,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [officerData, setOfficerData] = useState<any>(null);

  // Check authentication and load officer data
  useEffect(() => {
    const officerToken = localStorage.getItem("officerToken");
    const storedOfficerData = localStorage.getItem("officerData");
    
    if (!officerToken || !storedOfficerData) {
      navigate("/officer-login");
    } else {
      setOfficerData(JSON.parse(storedOfficerData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("officerToken");
    localStorage.removeItem("officerData");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from officer portal.",
    });
    navigate("/officer-login");
  };

  const handleStatusUpdate = (complaintId: string, newStatus: string, notes?: string) => {
    toast({
      title: "Status Updated",
      description: `Complaint ${complaintId} status updated to ${newStatus}`,
    });
    setIsDetailDialogOpen(false);
  };

  // Mock data for officer's department
  const stats = {
    total: 45,
    pending: 12,
    inProgress: 18,
    resolved: 15
  };

  const mockComplaints = [
    {
      id: "CT-2024-001",
      title: "Pothole on Main Street",
      category: "Infrastructure",
      location: "Main St & 5th Ave",
      status: "In Progress",
      priority: "High",
      reportedBy: "john.doe@email.com",
      date: "2024-01-15",
      assignedDate: "2024-01-16",
      description: "Large pothole causing traffic issues near intersection. Multiple vehicles have been damaged.",
      photos: ["photo1.jpg", "photo2.jpg"]
    },
    {
      id: "CT-2024-003",
      title: "Road Surface Damage",
      category: "Infrastructure", 
      location: "Oak Avenue Block 200",
      status: "Received",
      priority: "Medium",
      reportedBy: "mary.wilson@email.com",
      date: "2024-01-18",
      assignedDate: "2024-01-18",
      description: "Cracked road surface after heavy rain, needs inspection and repair.",
      photos: ["road1.jpg"]
    },
    {
      id: "CT-2024-005",
      title: "Traffic Sign Damaged",
      category: "Infrastructure",
      location: "Pine Street & 2nd Ave", 
      status: "Resolved",
      priority: "Low",
      reportedBy: "david.chen@email.com",
      date: "2024-01-12",
      assignedDate: "2024-01-13",
      resolvedDate: "2024-01-17",
      description: "Stop sign damaged by vehicle accident, replaced with new sign.",
      photos: ["sign1.jpg"]
    }
  ];

  const trendData = [
    { month: "Oct", complaints: 38, resolved: 35 },
    { month: "Nov", complaints: 42, resolved: 38 },
    { month: "Dec", complaints: 45, resolved: 40 },
    { month: "Jan", complaints: 35, resolved: 32 }
  ];

  const categoryData = [
    { name: "Road Repairs", value: 60, color: "#8b5cf6" },
    { name: "Traffic Signs", value: 25, color: "#06b6d4" },
    { name: "Sidewalks", value: 15, color: "#10b981" }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      "Received": "bg-blue-100 text-blue-800 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200", 
      "Resolved": "bg-green-100 text-green-800 border-green-200"
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors["Received"]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      "Low": "bg-gray-100 text-gray-800 border-gray-200",
      "Medium": "bg-orange-100 text-orange-800 border-orange-200",
      "High": "bg-red-100 text-red-800 border-red-200"
    };

    return (
      <Badge className={colors[priority as keyof typeof colors] || colors["Medium"]}>
        {priority}
      </Badge>
    );
  };

  if (!officerData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Municipal Officer Dashboard</h1>
            <p className="text-muted-foreground">{officerData.name} - {officerData.department}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="complaints">My Complaints</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assigned Complaints</CardTitle>
                    <CardDescription>Manage complaints assigned to {officerData.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search complaints..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Complaints Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                        <TableCell className="font-medium">{complaint.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{complaint.location}</TableCell>
                        <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                        <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                        <TableCell className="text-sm">{complaint.date}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Complaints vs resolution rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="complaints" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complaints by Type</CardTitle>
                  <CardDescription>Distribution in your department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Officer Profile</CardTitle>
                <CardDescription>Update your profile information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Officer ID</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{officerData.id}</p>
                </div>
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm bg-muted p-2 rounded">{officerData.name}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-sm bg-muted p-2 rounded">{officerData.department}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="text-sm bg-muted p-2 rounded">{officerData.role}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Resources and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View complaint details by clicking the eye icon</li>
                    <li>• Update complaint status using the update form</li>
                    <li>• Use filters to find specific complaints</li>
                    <li>• Check your performance metrics in Analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Support</h4>
                  <p className="text-sm text-muted-foreground">
                    For technical issues, contact IT Support at ext. 2200 or email tech-support@city.gov
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.title}</DialogTitle>
                <DialogDescription>
                  Complaint ID: {selectedComplaint.id} • Reported on {selectedComplaint.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedComplaint.priority)}</div>
                  </div>
                </div>

                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedComplaint.location}
                  </p>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
                </div>

                <div>
                  <Label>Update Status</Label>
                  <Select onValueChange={(value) => handleStatusUpdate(selectedComplaint.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Update Notes</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Add notes about this status update..."
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleStatusUpdate(selectedComplaint.id, "updated")}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficerDashboard;