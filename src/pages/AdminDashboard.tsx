import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Download, 
  Search,
  Filter,
  LogOut,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Check authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from admin panel.",
    });
    navigate("/admin-login");
  };

  // Mock data for demonstration
  const stats = {
    total: 1247,
    pending: 89,
    inProgress: 156,
    resolved: 1002
  };

  const mockIssues = [
    {
      id: "CT-2024-001",
      title: "Pothole on Main Street",
      category: "Infrastructure",
      location: "Main St & 5th Ave",
      status: "In Progress",
      priority: "High",
      reportedBy: "john.doe@email.com",
      date: "2024-01-15",
      assignedTo: "Road Dept."
    },
    {
      id: "CT-2024-002", 
      title: "Broken Street Light",
      category: "Utilities",
      location: "Park Avenue",
      status: "Resolved",
      priority: "Medium",
      reportedBy: "jane.smith@email.com",
      date: "2024-01-14",
      assignedTo: "Electric Dept."
    },
    {
      id: "CT-2024-003",
      title: "Garbage Collection Missed",
      category: "Sanitation",
      location: "Elm Street Block",
      status: "Received",
      priority: "Low",
      reportedBy: "mike.johnson@email.com", 
      date: "2024-01-16",
      assignedTo: "Pending"
    }
  ];

  const trendData = [
    { month: "Oct", reports: 98, resolved: 89 },
    { month: "Nov", reports: 125, resolved: 108 },
    { month: "Dec", reports: 147, resolved: 132 },
    { month: "Jan", reports: 89, resolved: 95 }
  ];

  const categoryData = [
    { name: "Infrastructure", value: 45, color: "#8b5cf6" },
    { name: "Utilities", value: 25, color: "#06b6d4" },
    { name: "Sanitation", value: 20, color: "#10b981" },
    { name: "Transportation", value: 10, color: "#f59e0b" }
  ];

  const departmentPerformance = [
    { dept: "Road Dept.", resolved: 45, pending: 12, avgTime: "3.2 days" },
    { dept: "Electric Dept.", resolved: 38, pending: 8, avgTime: "2.1 days" },
    { dept: "Water Dept.", resolved: 29, pending: 15, avgTime: "4.8 days" },
    { dept: "Sanitation", resolved: 52, pending: 6, avgTime: "1.5 days" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "Received": "secondary",
      "In Progress": "default",
      "Resolved": "default"
    };
    
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CivicTrack Admin Dashboard</h1>
            <p className="text-muted-foreground">Municipal Issue Management System</p>
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
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
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
              <p className="text-xs text-muted-foreground">+8% resolution rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="issues">Issue Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Issues</CardTitle>
                    <CardDescription>Manage and track civic issue reports</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
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
                        placeholder="Search issues..." 
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
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issues Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-mono text-sm">{issue.id}</TableCell>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell>{issue.category}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{issue.location}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                        <TableCell className="text-sm">{issue.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
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
                  <CardTitle>Issues Trend</CardTitle>
                  <CardDescription>Monthly reports vs resolution rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="reports" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                  <CardDescription>Distribution of reported issues</CardDescription>
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

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Track department efficiency and response times</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Avg. Resolution Time</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentPerformance.map((dept) => (
                      <TableRow key={dept.dept}>
                        <TableCell className="font-medium">{dept.dept}</TableCell>
                        <TableCell>{dept.resolved}</TableCell>
                        <TableCell>{dept.pending}</TableCell>
                        <TableCell>{dept.avgTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${(dept.resolved / (dept.resolved + dept.pending)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((dept.resolved / (dept.resolved + dept.pending)) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Monthly Report</span>
                  </CardTitle>
                  <CardDescription>Comprehensive monthly analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate PDF</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Performance Report</span>
                  </CardTitle>
                  <CardDescription>Department performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Export Excel</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>User Activity</span>
                  </CardTitle>
                  <CardDescription>Citizen engagement statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Download CSV</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;