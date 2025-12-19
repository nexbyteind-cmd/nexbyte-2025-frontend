import { motion } from "framer-motion";
import { 
  Share2, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  MessageSquare, 
  Video, 
  Target, 
  Zap 
} from "lucide-react";

const services = [
  {
    icon: Share2,
    title: "Social Media Management",
    description: "End-to-end management including content planning, creative posts, reels optimization, and audience engagement strategies.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Social Media Marketing",
    description: "Strategic campaigns, ad performance optimization, and boosting services to maximize your brand visibility and reach.",
    color: "accent",
  },
  {
    icon: Globe,
    title: "Website Development",
    description: "From simple business websites to complex enterprise platforms, we build scalable, modern, and high-performing web solutions.",
    color: "success",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Data-driven decisions with comprehensive video and post analytics, performance tracking, and actionable growth insights.",
    color: "primary",
  },
  {
    icon: Video,
    title: "Video Content Strategy",
    description: "Reels, shorts, and long-form video optimization to capture attention and drive engagement across all platforms.",
    color: "accent",
  },
  {
    icon: Target,
    title: "Audience Growth",
    description: "Targeted strategies to expand your reach, improve engagement rates, and convert followers into loyal customers.",
    color: "success",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "group-hover:border-primary/30",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "group-hover:border-accent/30",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "group-hover:border-success/30",
  },
};

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Complete Digital Solutions for{" "}
            <span className="text-gradient-primary">Every Business</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From content creation to analytics, we provide comprehensive services 
            that drive real results for businesses of all sizes.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 ${colors.border}`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.bg} ${colors.text} mb-6`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                
                {/* Hover gradient effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Need a custom solution? <span className="text-primary font-medium">We've got you covered.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
