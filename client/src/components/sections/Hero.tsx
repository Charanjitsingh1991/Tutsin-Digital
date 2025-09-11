import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: "1s"}}></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: "2s"}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6" data-testid="text-hero-title">
              <span className="text-gradient">Your Vision</span><br />
              <span className="text-foreground">Our Mission</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
              Transform your digital presence with cutting-edge web design, AI-powered SEO strategies, and data-driven marketing solutions that convert visitors into customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="gradient-bg text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 neon-glow" data-testid="button-start-project">
                Start Your Project
              </Button>
              <Button variant="outline" className="border border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all" data-testid="button-view-work">
                View Our Work
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 mt-12">
              <div className="text-center" data-testid="stat-projects">
                <div className="text-3xl font-bold text-gradient">500+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="text-center" data-testid="stat-satisfaction">
                <div className="text-3xl font-bold text-gradient">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="text-center" data-testid="stat-support">
                <div className="text-3xl font-bold text-gradient">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern digital workspace with analytics and code" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
                data-testid="img-hero-workspace"
              />
              
              <div className="absolute -top-4 -left-4 glass rounded-xl p-4 animate-float" data-testid="floating-icon-code">
                <i className="fas fa-code text-2xl text-primary"></i>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-xl p-4 animate-float" style={{animationDelay: "0.5s"}} data-testid="floating-icon-chart">
                <i className="fas fa-chart-line text-2xl text-green-400"></i>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4 animate-float" style={{animationDelay: "1s"}} data-testid="floating-icon-mobile">
                <i className="fas fa-mobile-alt text-2xl text-purple-400"></i>
              </div>
              <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4 animate-float" style={{animationDelay: "1.5s"}} data-testid="floating-icon-search">
                <i className="fas fa-search text-2xl text-cyan-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
