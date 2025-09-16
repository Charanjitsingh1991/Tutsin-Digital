import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹15,999",
      description: "Perfect for small businesses",
      features: [
        "5-Page Responsive Website",
        "Basic SEO Setup",
        "1 Year Free Hosting",
        "SSL Certificate",
        "Contact Form Integration",
        "3 Months Support"
      ],
      isPopular: false,
      buttonText: "Choose Starter"
    },
    {
      name: "Professional",
      price: "₹29,999",
      description: "Ideal for growing businesses",
      features: [
        "10-Page Custom Website",
        "Advanced SEO & Local SEO",
        "1 Year Premium Hosting",
        "Google My Business Setup",
        "Social Media Integration",
        "Live Chat Integration",
        "6 Months Support"
      ],
      isPopular: true,
      buttonText: "Choose Professional"
    },
    {
      name: "Enterprise",
      price: "₹49,999",
      description: "Complete digital solution",
      features: [
        "Custom Web Application",
        "Complete SEO & Marketing",
        "Cloud VPS Hosting",
        "PPC Campaign Setup",
        "Email Marketing Setup",
        "Analytics & Reporting",
        "12 Months Support"
      ],
      isPopular: false,
      buttonText: "Choose Enterprise"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-pricing-title">
            <span className="text-gradient">Affordable Pricing Plans</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-pricing-description">
            Get professional websites and marketing services at competitive prices. No hidden fees, transparent pricing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 bg-card border-2 border-gray-200 shadow-lg hover:scale-105 transition-all duration-300 relative ${
                plan.isPopular ? 'border-2 border-primary' : ''
              }`}
              data-testid={`card-plan-${index}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2" data-testid="badge-popular">
                  <span className="gradient-bg text-white px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
              )}
              
              <div className={`text-center mb-8 ${plan.isPopular ? 'mt-4' : ''}`}>
                <h3 className="text-2xl font-bold mb-4" data-testid={`title-plan-${index}`}>{plan.name}</h3>
                <div className="text-4xl font-bold text-gradient mb-2" data-testid={`price-plan-${index}`}>{plan.price}</div>
                <p className="text-muted-foreground" data-testid={`description-plan-${index}`}>{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center" data-testid={`feature-plan-${index}-${featureIndex}`}>
                    <i className="fas fa-check text-green-400 mr-3"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-3 font-semibold transition-all ${
                  plan.isPopular 
                    ? 'gradient-bg text-white hover:opacity-90 neon-glow' 
                    : 'border border-primary text-primary hover:bg-primary hover:text-white'
                }`}
                variant={plan.isPopular ? "default" : "outline"}
                data-testid={`button-plan-${index}`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
