import { Contact } from "@/components/sections/Contact";

export default function WebDesign() {
  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-web-design-title">
              <span className="text-gradient">Web Design & Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="text-web-design-description">
              Ensure seamless user experience across devices to maximize conversions with our 100% responsive website designs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" data-testid="text-responsive-title">
                <span className="text-gradient">100% Responsive Design</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8" data-testid="text-responsive-description">
                Our websites automatically adjust to provide optimal viewing experience across all devices - from desktop computers to tablets and mobile phones.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="glass rounded-xl p-6 text-center" data-testid="card-device-desktop">
                  <i className="fas fa-desktop text-3xl text-primary mb-4"></i>
                  <h3 className="font-semibold text-foreground">Desktop</h3>
                  <p className="text-sm text-muted-foreground">Full HD & 4K ready</p>
                </div>
                <div className="glass rounded-xl p-6 text-center" data-testid="card-device-laptop">
                  <i className="fas fa-laptop text-3xl text-primary mb-4"></i>
                  <h3 className="font-semibold text-foreground">Laptop</h3>
                  <p className="text-sm text-muted-foreground">Optimized layout</p>
                </div>
                <div className="glass rounded-xl p-6 text-center" data-testid="card-device-tablet">
                  <i className="fas fa-tablet-alt text-3xl text-primary mb-4"></i>
                  <h3 className="font-semibold text-foreground">Tablet</h3>
                  <p className="text-sm text-muted-foreground">Touch-friendly UI</p>
                </div>
                <div className="glass rounded-xl p-6 text-center" data-testid="card-device-mobile">
                  <i className="fas fa-mobile-alt text-3xl text-primary mb-4"></i>
                  <h3 className="font-semibold text-foreground">Mobile</h3>
                  <p className="text-sm text-muted-foreground">Fast & intuitive</p>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Responsive web design on multiple devices" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
                data-testid="img-responsive-design"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-features-title">
              <span className="text-gradient">Advanced Features</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-feature-security">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Advanced Security</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>cPHulk Brute Force Protection</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>SSL Certificate Included</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>Regular Security Updates</li>
              </ul>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-feature-speed">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Lightning Speed</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>2-3 Second Load Times</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>30+ Speed Optimizations</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>Cloud SSD Storage</li>
              </ul>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-feature-support">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-comments text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Interactive Features</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>Live Chat Integration</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>Click to Call Buttons</li>
                <li className="flex items-center"><i className="fas fa-check text-green-400 mr-2"></i>Mobile App Compatible</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
