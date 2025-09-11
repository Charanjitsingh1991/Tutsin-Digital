export default function Terms() {
  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-terms-title">
              <span className="text-gradient">Terms & Conditions</span>
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-terms-description">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-foreground">
              
              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-intellectual-property">Intellectual Property</h2>
              <p className="mb-6 leading-relaxed">
                All intellectual property rights, including but not limited to trademarks, copyrights, patents, and trade secrets, related to the services provided by Tutsin are owned exclusively by Tutsin Digital Marketing Agency. This includes all website designs, marketing strategies, content, code, and methodologies developed for clients.
              </p>

              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-termination">Termination</h2>
              <p className="mb-6 leading-relaxed">
                Tutsin reserves the right to terminate any service agreement without prior notice if the client violates any terms of service, engages in fraudulent activities, or fails to make required payments. Upon termination, all services will be discontinued immediately, and any outstanding balances become due immediately.
              </p>

              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-third-party-links">Third-Party Links</h2>
              <p className="mb-6 leading-relaxed">
                Our website and services may contain links to third-party websites or services. Tutsin takes no responsibility for the content, privacy policies, or practices of these external sites. We do not endorse or assume any liability for third-party content or services. Users access third-party links at their own risk.
              </p>

              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-refunds">Refunds for Digital Products</h2>
              <p className="mb-6 leading-relaxed">
                Due to the nature of digital products and services, including but not limited to website development, digital marketing campaigns, SEO services, and hosting solutions, all sales are final. No refunds will be provided once work has commenced or digital deliverables have been provided. This policy is in place due to the immediate nature of digital service delivery.
              </p>

              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-changes-to-agreement">Changes to Agreement</h2>
              <p className="mb-6 leading-relaxed">
                Tutsin reserves the right to modify these terms and conditions at any time without prior notice. Any changes will be effective immediately upon posting on our website. Continued use of our services after changes have been posted constitutes acceptance of the modified terms. It is the client's responsibility to review these terms regularly.
              </p>

              <h2 className="text-2xl font-bold text-gradient mb-6" data-testid="text-contact-us">Contact Us</h2>
              <p className="mb-6 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-secondary/20 rounded-xl p-6 mt-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center" data-testid="contact-info-email">
                    <i className="fas fa-envelope text-primary mr-3"></i>
                    <span>Email: contact@tutsin.in</span>
                  </li>
                  <li className="flex items-center" data-testid="contact-info-phone">
                    <i className="fas fa-phone text-primary mr-3"></i>
                    <span>Phone: +91 9876543210</span>
                  </li>
                  <li className="flex items-center" data-testid="contact-info-address">
                    <i className="fas fa-map-marker-alt text-primary mr-3"></i>
                    <span>Address: Mumbai, Maharashtra, India</span>
                  </li>
                </ul>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground text-center" data-testid="text-last-updated">
                  Last updated: March 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
