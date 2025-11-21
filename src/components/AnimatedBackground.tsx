import { Users, UserCheck, UserCog } from "lucide-react";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Walking People Animation */}
      <div className="absolute bottom-20 left-0 right-0 h-20">
        {/* Person 1 - Regular citizen */}
        <div className="absolute bottom-0 animate-walk-right">
          <div className="flex items-end space-x-2 opacity-30">
            <Users className="w-8 h-8 text-primary" />
            <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Person 2 - Staff member */}
        <div className="absolute bottom-0 animate-walk-right-delayed">
          <div className="flex items-end space-x-2 opacity-25">
            <UserCheck className="w-8 h-8 text-secondary" />
            <div className="w-1 h-4 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Person 3 - Admin */}
        <div className="absolute bottom-0 animate-walk-right-slow">
          <div className="flex items-end space-x-2 opacity-20">
            <UserCog className="w-8 h-8 text-status-progress" />
            <div className="w-1 h-4 bg-status-progress rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 animate-float opacity-10">
        <div className="w-12 h-12 rounded-full bg-primary/20 blur-sm" />
      </div>
      
      <div className="absolute top-1/3 right-1/3 animate-float opacity-10" style={{ animationDelay: "1s" }}>
        <div className="w-8 h-8 rounded-full bg-secondary/20 blur-sm" />
      </div>
      
      <div className="absolute bottom-1/3 left-1/3 animate-float opacity-10" style={{ animationDelay: "2s" }}>
        <div className="w-10 h-10 rounded-full bg-status-received/20 blur-sm" />
      </div>

      {/* Queue Lines - Subtle dotted paths */}
      <div className="absolute bottom-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" style={{ animationDelay: "0.5s" }} />
    </div>
  );
};

export default AnimatedBackground;