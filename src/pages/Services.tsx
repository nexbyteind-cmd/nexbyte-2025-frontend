import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Share2, 
  TrendingUp, 
  Globe, 
  Video, 
  Palette, 
  Users,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  PenTool,
  BarChart3,
  Rocket
} from "lucide-react";

const services = [
  {
    icon: Share2,
    title: "Social Media Management",
    description: "End-to-end social media management across all major platforms with content planning, scheduling, and community engagement.",
    benefits: ["Content calendar planning", "Daily posting & scheduling", "Community management", "Brand voice consistency"],
    color: "primary"
  },
  {
    icon: TrendingUp,
    title: "Social Media Marketing & Ads",
    description: "Strategic paid advertising campaigns with targeting, A/B testing, and continuous optimization for maximum ROI.",
    benefits: ["Targeted ad campaigns", "A/B testing & optimization", "Budget management", "Performance tracking"],
    color: "accent"
  },
  {
    icon: Globe,
    title: "Website Development",
    description: "From simple business websites to complex enterprise platforms, we build scalable, secure, and stunning digital experiences.",
    benefits: ["Responsive design", "SEO optimization", "Fast loading speeds", "Secure architecture"],
    color: "success"
  },
  {
    icon: Video,
    title: "Video Content Strategy",
    description: "Engaging video content including reels, shorts, and long-form videos optimized for each platform's algorithm.",
    benefits: ["Platform-specific formats", "Trending content creation", "Script & storyboarding", "Post-production editing"],
    color: "primary"
  },
  {
    icon: Palette,
    title: "Branding & Design",
    description: "Complete brand identity design including logos, color palettes, typography, and comprehensive brand guidelines.",
    benefits: ["Logo design", "Brand guidelines", "Marketing collateral", "Visual identity system"],
    color: "accent"
  },
  {
    icon: Users,
    title: "Audience Growth",
    description: "Data-driven strategies to grow your audience organically and build a loyal community around your brand.",
    benefits: ["Organic growth tactics", "Influencer partnerships", "Engagement strategies", "Audience analytics"],
    color: "success"
  }
];

const processSteps = [
  { icon: Lightbulb, title: "Strategy", description: "Deep dive into your business goals and target audience" },
  { icon: PenTool, title: "Creation", description: "Craft compelling content and campaigns" },
  { icon: BarChart3, title: "Optimization", description: "Analyze performance and refine approach" },
  { icon: Rocket, title: "Growth", description: "Scale successful strategies for maximum impact" }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Complete Digital Services for{" "}
              <span className="text-gradient-primary">Modern Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From strategy to execution, we provide comprehensive digital solutions that drive 
              real results. Our integrated approach ensures every aspect of your digital presence 
              works together seamlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.color === "primary" ? "bg-primary/10 text-primary" :
                  service.color === "accent" ? "bg-accent/10 text-accent" :
                  "bg-success/10 text-success"
                }`}>
                  <service.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                <ul className="space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We Deliver Results
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our proven 4-step process ensures consistent, measurable outcomes for every project.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-border">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
              Real Results
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Before vs After Growth Results
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the tangible impact our services have on our clients' digital presence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { metric: "Social Engagement", before: "2.1%", after: "8.7%", increase: "+314%" },
              { metric: "Website Traffic", before: "1.2K", after: "15K", increase: "+1150%" },
              { metric: "Lead Generation", before: "45", after: "380", increase: "+744%" }
            ].map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <h4 className="font-medium text-muted-foreground mb-4">{item.metric}</h4>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Before</p>
                    <p className="text-2xl font-bold">{item.before}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">After</p>
                    <p className="text-2xl font-bold text-primary">{item.after}</p>
                  </div>
                </div>
                
                <span className="inline-block px-3 py-1 bg-success/10 text-success rounded-full text-sm font-bold">
                  {item.increase}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Get affordable, scalable solutions tailored to your business needs. 
              Let's discuss how we can help you achieve your growth goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-foreground">
                Schedule Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
