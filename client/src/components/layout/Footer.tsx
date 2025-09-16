import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img src="/logo.png" alt="Tutsin Digital Logo" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <p className="text-muted-foreground mb-6">
              Your trusted partner for digital transformation. We create stunning websites and drive digital growth for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/web-design" data-testid="link-web-design"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Web Design</span></Link></li>
              <li><Link href="/services#seo" data-testid="link-seo"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">SEO Optimization</span></Link></li>
              <li><Link href="/services#social-media" data-testid="link-social-media"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Social Media Marketing</span></Link></li>
              <li><Link href="/services#ppc" data-testid="link-ppc"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">PPC Management</span></Link></li>
              <li><Link href="/services#email" data-testid="link-email"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Email Marketing</span></Link></li>
              <li><Link href="/hosting" data-testid="link-hosting"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Web Hosting</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" data-testid="link-about"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/blog" data-testid="link-blog"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Blog</span></Link></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact">Contact</a></li>
              <li><Link href="/terms" data-testid="link-terms"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Terms & Conditions</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6">Contact Info</h4>
            <ul className="space-y-3">
              <li className="text-muted-foreground flex items-center" data-testid="text-phone">
                <Phone size={16} className="mr-2" />
                +91 9876543210
              </li>
              <li className="text-muted-foreground flex items-center" data-testid="text-email">
                <Mail size={16} className="mr-2" />
                contact@tutsin.in
              </li>
              <li className="text-muted-foreground flex items-center" data-testid="text-location">
                <MapPin size={16} className="mr-2" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground" data-testid="text-copyright">
            © 2018-{currentYear} Tutsin. All rights reserved. Intellectual Property owned by Tutsin Digital Marketing Agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
