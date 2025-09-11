import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertContactSubmission } from "@shared/schema";

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    message: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        service: "",
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.service || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-contact-title">
            <span className="text-gradient">Let's Start Your Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-description">
            Ready to transform your digital presence? Get in touch and let's discuss how we can help your business grow.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground" data-testid="text-get-in-touch">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4" data-testid="contact-phone">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <i className="fas fa-phone text-white"></i>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Phone</div>
                  <div className="text-muted-foreground">+91 9876543210</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-testid="contact-email">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <i className="fas fa-envelope text-white"></i>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Email</div>
                  <div className="text-muted-foreground">contact@tutsin.in</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-testid="contact-office">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-white"></i>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Office</div>
                  <div className="text-muted-foreground">Mumbai, Maharashtra, India</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-social-facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-social-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-social-linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-social-instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} data-testid="form-contact">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-2"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-2"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-2"
                  data-testid="input-email"
                />
              </div>
              
              <div className="mb-6">
                <Label className="text-foreground">Service Interested In</Label>
                <Select onValueChange={(value) => handleInputChange('service', value)} data-testid="select-service">
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Design & Development">Web Design & Development</SelectItem>
                    <SelectItem value="SEO & Digital Marketing">SEO & Digital Marketing</SelectItem>
                    <SelectItem value="Social Media Marketing">Social Media Marketing</SelectItem>
                    <SelectItem value="PPC Management">PPC Management</SelectItem>
                    <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                    <SelectItem value="Web Hosting">Web Hosting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="mt-2"
                  data-testid="textarea-message"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all neon-glow"
                disabled={contactMutation.isPending}
                data-testid="button-send-message"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
