import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Femora Healthcare" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="p-3 bg-primary/10 rounded-full backdrop-blur-sm">
          <Heart className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="p-3 bg-secondary/10 rounded-full backdrop-blur-sm">
          <Shield className="w-6 h-6 text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="p-3 bg-accent/10 rounded-full backdrop-blur-sm">
          <Sparkles className="w-6 h-6 text-accent-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight pt-[20vh]">
              <span className="bg-gradient-primary bg-clip-text text-transparent ">
                Empowering
              </span>
              <br />
              <span className="text-foreground">Women's Health</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Advanced PCOS detection through AI-powered Ultrasound analysis, 
            personalized period tracking, and intelligent health insights.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Detection</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Period Tracking</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Smart Insights</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button variant="feminine" size="xl" className="group">

              Get Started Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>

{/* Testimonials */}
          <div className="pt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-2xl font-semibold mb-8 text-center">What Women Are Saying</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">S</div>
                  <div className="ml-3">
                    <p className="font-medium">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Diagnosed with PCOS</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"Femora helped me understand my PCOS better than any doctor's visit. The AI analysis was spot-on and gave me confidence in my diagnosis."</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">E</div>
                  <div className="ml-3">
                    <p className="font-medium">Emily R.</p>
                    <p className="text-sm text-muted-foreground">Regular User</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"The period tracking is incredible. It predicted my irregular cycle patterns and helped me plan better. The AI chat is like having a health expert available 24/7."</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="py-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of women worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-medium">🏥 Clinically Validated</div>
              <div className="text-xs font-medium">🔒 HIPAA Compliant</div>
              <div className="text-xs font-medium">🌟 4.9/5 Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;