import { Services as ServicesSection } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export default function Services() {
  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-services-page-title">
              <span className="text-gradient">Our Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="text-services-page-description">
              Our agency delivers comprehensive solutions to boost your online presence and sales. From custom website design to advanced digital marketing strategies, we provide everything you need to succeed in the digital landscape.
            </p>
          </div>
        </div>
      </section>
      
      <ServicesSection />
      
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-additional-services-title">
              <span className="text-gradient">Additional Services</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-0">
              <h3 className="text-xl font-bold mb-4 text-foreground">Logo & Video Design</h3>
              <p className="text-muted-foreground">Professional branding solutions including custom logo design and promotional video creation to establish your unique brand identity.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-1">
              <h3 className="text-xl font-bold mb-4 text-foreground">Mobile Application Design</h3>
              <p className="text-muted-foreground">Custom mobile app interfaces designed for optimal user experience across iOS and Android platforms.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-2">
              <h3 className="text-xl font-bold mb-4 text-foreground">Custom Email Design</h3>
              <p className="text-muted-foreground">Beautiful, responsive email templates that drive engagement and conversions across all email clients.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-3">
              <h3 className="text-xl font-bold mb-4 text-foreground">Link Building & Content</h3>
              <p className="text-muted-foreground">Strategic content creation and high-quality backlink acquisition to improve your search engine rankings.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-4">
              <h3 className="text-xl font-bold mb-4 text-foreground">Maps Search Optimization</h3>
              <p className="text-muted-foreground">Local business optimization to ensure your company appears prominently in Google Maps and local search results.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300" data-testid="card-additional-service-5">
              <h3 className="text-xl font-bold mb-4 text-foreground">Paid Search Advertising</h3>
              <p className="text-muted-foreground">Expert management of Google Ads and Bing Ads campaigns for maximum ROI and targeted traffic generation.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Contact />
    </div>
  );
}
