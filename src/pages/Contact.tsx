import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Globe, Headphones, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    primary: "hello@digitalpro.com",
    secondary: "support@digitalpro.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 9am to 6pm",
    primary: "+1 (555) 123-4567",
    secondary: "+1 (555) 987-6543",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello",
    primary: "123 Digital Avenue, Suite 100",
    secondary: "San Francisco, CA 94105",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're here when you need us",
    primary: "Mon-Fri: 9:00 AM - 6:00 PM",
    secondary: "Sat: 10:00 AM - 4:00 PM",
  },
];

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Sales Inquiries",
    description: "Talk to our sales team about your project needs and get a custom quote.",
    action: "Contact Sales",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "Get help with your existing projects and technical questions.",
    action: "Get Support",
  },
  {
    icon: Globe,
    title: "Partnerships",
    description: "Interested in partnering with us? Let's discuss opportunities.",
    action: "Partner With Us",
  },
];

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          message: ""
        });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send message. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Contact Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Let's Build Something <span className="text-primary">Amazing</span> Together
              </h1>
              <p className="text-xl text-muted-foreground">
                Have a project in mind? We'd love to hear about it. Get in touch and let's start a conversation about your digital growth.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-sm font-medium">{method.primary}</p>
                  <p className="text-sm text-muted-foreground">{method.secondary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-16">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-secondary/30 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-sm font-medium mb-2 block">First Name *</label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="bg-background"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm font-medium mb-2 block">Last Name *</label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="bg-background"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">Email Address *</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="bg-background"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="text-sm font-medium mb-2 block">Company Name</label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="text-sm font-medium mb-2 block">Service Interested In *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="smm">Social Media Management</option>
                      <option value="marketing">Social Media Marketing & Ads</option>
                      <option value="web">Website Development</option>
                      <option value="analytics">Analytics & Insights</option>
                      <option value="branding">Branding & Design</option>
                      <option value="full">Full Digital Package</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="text-sm font-medium mb-2 block">Project Budget</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select budget range</option>
                      <option value="small">$1,000 - $5,000</option>
                      <option value="medium">$5,000 - $15,000</option>
                      <option value="large">$15,000 - $50,000</option>
                      <option value="enterprise">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">Tell Us About Your Project *</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your project, goals, timeline, and any specific requirements..."
                      className="bg-background min-h-[150px]"
                      required
                    />
                  </div>

                  <Button variant="success" size="lg" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {loading ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              </motion.div>

              {/* Right Side Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Support Options */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">How Can We Help?</h2>
                  <div className="space-y-4">
                    {supportOptions.map((option, index) => (
                      <div
                        key={index}
                        className="bg-background border border-border/50 rounded-xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <option.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{option.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                          <Button variant="link" className="p-0 h-auto text-primary">
                            {option.action} →
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Response Promise */}
                <div className="bg-success/10 rounded-xl p-6 border border-success/20">
                  <h3 className="font-semibold text-success mb-2">24-Hour Response Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    We respond to all inquiries within 24 hours during business days. For urgent matters, call us directly for immediate assistance.
                  </p>
                </div>

                {/* FAQ Teaser */}
                <div className="bg-secondary/30 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">How long does a typical project take?</p>
                      <p className="text-muted-foreground">Project timelines vary based on scope, typically 2-12 weeks.</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Do you offer ongoing support?</p>
                      <p className="text-muted-foreground">Yes, we offer monthly retainer packages for continuous growth.</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">What industries do you work with?</p>
                      <p className="text-muted-foreground">We work with businesses across all industries and sizes.</p>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-secondary/50 rounded-xl h-48 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
