import { Palette, Search, Share2, Mail, Target, Server } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Palette,
      title: "Web Design & Development",
      description: "Craft stunning, responsive websites that convert visitors into customers. 100% mobile-optimized with lightning-fast loading speeds and modern UI/UX principles.",
      features: [
        "Responsive Design (Desktop, Tablet, Mobile)",
        "2-3 Second Load Times",
        "SSL Security & Cloud SSD Hosting",
        "Live Chat Integration"
      ]
    },
    {
      icon: Search,
      title: "Premium SEO & Local Search",
      description: "Drive organic traffic with expert audits, AI-powered content strategies, and advanced local SEO to bring customers through your doors.",
      features: [
        "Google Maps Optimization",
        "Technical SEO Audits",
        "Content Strategy & Link Building",
        "Local Reviews Management"
      ]
    },
    {
      icon: Share2,
      title: "Social Media Marketing",
      description: "Grow your business and engage audiences across all platforms with data-driven social media strategies and compelling content creation.",
      features: [
        "Multi-Platform Management",
        "Content Creation & Scheduling",
        "Audience Targeting & Analytics",
        "Community Management"
      ]
    },
    {
      icon: Mail,
      title: "Email Marketing Automation",
      description: "Personalized campaigns that engage specific segments with automated workflows, A/B testing, and advanced analytics for maximum ROI.",
      features: [
        "Automated Drip Campaigns",
        "Segmentation & Personalization",
        "A/B Testing & Optimization",
        "Performance Analytics"
      ]
    },
    {
      icon: Target,
      title: "PPC & Paid Advertising",
      description: "Generate instant impact with expertly managed Google Ads, Facebook Ads, and multi-platform campaigns optimized for maximum conversions.",
      features: [
        "Google Ads Management",
        "Facebook & Instagram Ads",
        "Landing Page Optimization",
        "ROI Tracking & Reporting"
      ]
    },
    {
      icon: Server,
      title: "Web Hosting & Cloud Solutions",
      description: "Reliable hosting with Linux CentOS, SSD drives, free SSL certificates, and complete web solutions for optimal performance and security.",
      features: [
        "Shared, VPS & Reseller Hosting",
        "Cloud SSD Storage",
        "Free SSL & Security Features",
        "99.9% Uptime Guarantee"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-services-title">
            <span className="text-gradient">Comprehensive Digital Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
            From stunning web designs to AI-powered marketing strategies, we deliver end-to-end digital solutions that drive real business growth.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 group" data-testid={`card-service-${index}`}>
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:neon-glow" data-testid={`icon-service-${index}`}>
                  <IconComponent className="text-2xl text-primary-foreground" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground" data-testid={`title-service-${index}`}>{service.title}</h3>
                <p className="text-muted-foreground mb-6" data-testid={`description-service-${index}`}>
                  {service.description}
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center" data-testid={`feature-service-${index}-${featureIndex}`}>
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
