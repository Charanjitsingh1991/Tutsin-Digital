import { Contact } from "@/components/sections/Contact";

export default function Hosting() {
  const hostingPlans = [
    {
      name: "Shared Hosting",
      price: "₹199/month",
      description: "Perfect for small websites and blogs",
      features: [
        "10GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL Certificate",
        "cPanel Control Panel",
        "99.9% Uptime Guarantee",
        "24/7 Technical Support"
      ]
    },
    {
      name: "VPS Hosting",
      price: "₹999/month",
      description: "Scalable solution for growing businesses",
      features: [
        "50GB SSD Storage",
        "4GB RAM Memory",
        "Root Access Available",
        "Linux CentOS OS",
        "Free SSL Certificate",
        "Managed Support"
      ]
    },
    {
      name: "Reseller Hosting",
      price: "₹699/month",
      description: "Start your own hosting business",
      features: [
        "100GB SSD Storage",
        "Unlimited Accounts",
        "WHM Control Panel",
        "White Label Branding",
        "Free SSL Certificates",
        "24/7 Partner Support"
      ]
    }
  ];

  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hosting-title">
              <span className="text-gradient">Web Hosting Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="text-hosting-description">
              Choose us for Linux CentOS, SSD drives, free SSL—complete web solutions with reliable hosting infrastructure for optimal performance and security.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-hosting-plans-title">
              <span className="text-gradient">Hosting Plans</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {hostingPlans.map((plan, index) => (
              <div key={index} className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid={`card-hosting-plan-${index}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4" data-testid={`title-hosting-plan-${index}`}>{plan.name}</h3>
                  <div className="text-3xl font-bold text-gradient mb-2" data-testid={`price-hosting-plan-${index}`}>{plan.price}</div>
                  <p className="text-muted-foreground" data-testid={`description-hosting-plan-${index}`}>{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center" data-testid={`feature-hosting-plan-${index}-${featureIndex}`}>
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all" data-testid={`button-hosting-plan-${index}`}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-why-choose-hosting-title">
              <span className="text-gradient">Why Choose Our Hosting?</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="hosting-feature-0">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-server text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">SSD Storage</h3>
              <p className="text-muted-foreground">Lightning-fast SSD drives for superior website loading speeds and performance.</p>
            </div>
            
            <div className="text-center" data-testid="hosting-feature-1">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shield-alt text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Free SSL</h3>
              <p className="text-muted-foreground">Complimentary SSL certificates to secure your website and boost search rankings.</p>
            </div>
            
            <div className="text-center" data-testid="hosting-feature-2">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">99.9% Uptime</h3>
              <p className="text-muted-foreground">Guaranteed uptime with redundant infrastructure and proactive monitoring.</p>
            </div>
            
            <div className="text-center" data-testid="hosting-feature-3">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-headset text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">24/7 Support</h3>
              <p className="text-muted-foreground">Round-the-clock technical support from our experienced hosting specialists.</p>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
