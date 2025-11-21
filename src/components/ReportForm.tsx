import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Send, AlertTriangle, X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    urgency: "medium"
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&limit=1`
          );
          
          if (!response.ok) {
            // Fallback to coordinates if reverse geocoding fails
            setFormData({
              ...formData,
              location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          } else {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              setFormData({
                ...formData,
                location: data.results[0].formatted
              });
            } else {
              setFormData({
                ...formData,
                location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              });
            }
          }
          
          toast({
            title: "Location obtained",
            description: "Your current location has been added to the form.",
          });
        } catch (error) {
          console.error('Error getting location:', error);
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          toast({
            title: "Location added",
            description: "Coordinates have been added (address lookup failed).",
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let message = "Unable to get your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate report ID
    const newReportId = `CT-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Simulate upload/submission delay
    setTimeout(() => {
      setReportId(newReportId);
      toast({
        title: "Issue Reported Successfully!",
        description: `Your report has been submitted with ${photos.length} photo(s) and ${videos.length} video(s). Tracking ID: #${newReportId}`,
      });

      // Reset form
      setFormData({
        category: "",
        title: "",
        description: "",
        location: "",
        urgency: "medium"
      });
      setPhotos([]);
      setVideos([]);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const files = Array.from(e.target.files || []);
    
    if (type === 'photo') {
      setPhotos(prev => [...prev, ...files]);
    } else {
      setVideos(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number, type: 'photo' | 'video') => {
    if (type === 'photo') {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const categories = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "study_material", label: "Study Material" },
    { value: "teaching", label: "Teaching" },
    { value: "office", label: "Office / Administration" },
    { value: "cleaning", label: "Cleaning & Maintenance" },
    { value: "other", label: "Other Issues" }
  ];

  return (
    <section id="report" className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Report ID Display */}
        {reportId && (
          <div className="fixed top-6 left-6 z-40">
            <Card className="shadow-strong border-primary/20 bg-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">Report ID</p>
                    <p className="font-mono text-lg">{reportId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Report College Issue</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Report an issue in your college to help improve campus facilities and services.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>New Issue Report</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below to report an issue on campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input 
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Provide more details about the issue, including when you noticed it and any relevant information..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <Input 
                      id="location"
                      placeholder="Street address or nearby landmark"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pr-10"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      {isGettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click the pin icon to use your current location
                  </p>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Attach Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'photo')}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Click to upload photos or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>
                  </div>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'photo')}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Attach Videos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Click to upload videos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, MOV up to 50MB each
                        </p>
                      </label>
                    </div>
                  </div>

                  {videos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {videos.map((video, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={URL.createObjectURL(video)}
                            className="w-full h-20 object-cover rounded border"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'video')}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hover" 
                  size="lg"
                  disabled={isSubmitting || !formData.category || !formData.title || !formData.description}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;