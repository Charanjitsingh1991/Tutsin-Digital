import { Rocket, Shield, Brain, Headphones } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Rocket,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising quality. Most projects delivered within 2-4 weeks.",
      delay: "0s"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with SSL certificates, daily backups, and 99.9% uptime guarantee.",
      delay: "0.5s"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Leverage artificial intelligence for SEO optimization, content creation, and data-driven insights.",
      delay: "1s"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support with live chat, mobile apps, and dedicated account managers.",
      delay: "1.5s"
    }
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-why-choose-title">
            <span className="text-gradient">Why Choose Tutsin?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-why-choose-description">
            We combine cutting-edge technology with proven strategies to deliver exceptional results for your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center" data-testid={`feature-${index}`}>
                <div 
                  className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-float"
                  style={{ animationDelay: feature.delay }}
                  data-testid={`icon-feature-${index}`}
                >
                  <IconComponent className="text-3xl text-primary-foreground" size={36} />
                </div>
                <h3 className="text-xl font-bold mb-4" data-testid={`title-feature-${index}`}>{feature.title}</h3>
                <p className="text-muted-foreground" data-testid={`description-feature-${index}`}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
