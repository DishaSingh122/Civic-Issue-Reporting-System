import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Shield, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Student-Driven",
      description: "Empowering students to actively participate in improving their campus and college facilities."
    },
    {
      icon: Target,
      title: "Efficient Resolution",
      description: "Streamlined reporting and tracking system that connects issues directly to the relevant college departments."
    },
    {
      icon: Shield,
      title: "Transparent Process",
      description: "Real-time updates and full transparency in how campus issues are being addressed and resolved."
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Quick acknowledgment of reports with automated routing to HODs and departments."
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About College Issue Reporting System</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive platform designed to bridge the gap between students and 
            college administration, making it easier than ever to report, track, and resolve campus issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Report the Issue</h4>
                    <p className="text-muted-foreground text-sm">
                      Use our simple form to report college issues with photos, location, and detailed descriptions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Automatic Routing</h4>
                    <p className="text-muted-foreground text-sm">
                      Our system automatically routes your report to the relevant college department or HOD.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Track Progress</h4>
                    <p className="text-muted-foreground text-sm">
                      Monitor the status of your report and receive updates as it progresses toward resolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-light rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Join Our Campus Community</h3>
              <p className="text-muted-foreground mb-6">
                Be part of a growing community of engaged students working together to improve our college campus.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <div className="text-sm text-muted-foreground">Issues Reported</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">1,923</div>
                  <div className="text-sm text-muted-foreground">Issues Resolved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">5,672</div>
                  <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;