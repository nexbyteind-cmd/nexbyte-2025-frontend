import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, TrendingUp, Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, TechStart Inc.",
    content: "DigitalPro transformed our online presence completely. Our engagement increased by 340% in just 3 months. Their data-driven approach and creative content strategy exceeded all expectations. The team's dedication and expertise made all the difference.",
    rating: 5,
    metric: "340% Growth",
    image: "SM",
  },
  {
    name: "David Chen",
    role: "Marketing Director, GrowthHub",
    content: "The analytics insights provided by DigitalPro helped us understand our audience like never before. We've seen a significant ROI improvement and our brand visibility has skyrocketed. Highly recommend their services!",
    rating: 5,
    metric: "280% ROI",
    image: "DC",
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, StyleBoutique",
    content: "From website development to social media management, DigitalPro handled everything professionally. Our e-commerce sales doubled within the first quarter of working together. They truly understand digital commerce.",
    rating: 5,
    metric: "2x Sales",
    image: "ER",
  },
  {
    name: "Michael Thompson",
    role: "COO, FinanceFlow",
    content: "Working with DigitalPro has been a game-changer for our B2B lead generation. Their LinkedIn strategies and content marketing approach brought us high-quality leads consistently. The ROI speaks for itself.",
    rating: 5,
    metric: "180% Leads",
    image: "MT",
  },
  {
    name: "Lisa Park",
    role: "Brand Manager, EcoLiving",
    content: "The creativity and strategic thinking DigitalPro brings to the table is unmatched. They helped us build a strong brand identity across all platforms. Our community has grown exponentially.",
    rating: 5,
    metric: "500K Followers",
    image: "LP",
  },
  {
    name: "James Wilson",
    role: "Director, LocalEats Chain",
    content: "DigitalPro helped us expand from 2 locations to 8 through strategic digital marketing. Their local SEO and social media campaigns drove incredible foot traffic. Amazing results!",
    rating: 5,
    metric: "4x Locations",
    image: "JW",
  },
];

const caseStudies = [
  {
    title: "E-commerce Brand Revival",
    industry: "Retail & Fashion",
    challenge: "A struggling online fashion retailer was experiencing declining sales, poor social engagement, and losing market share to competitors.",
    solution: "Implemented comprehensive social media strategy, redesigned website for better UX, launched targeted ad campaigns, and created engaging video content.",
    results: [
      { metric: "250%", label: "Revenue Increase" },
      { metric: "180K", label: "New Followers" },
      { metric: "45%", label: "Lower CAC" },
      { metric: "3.2x", label: "ROAS" },
    ],
    duration: "6 months",
    platforms: ["Instagram", "Facebook", "TikTok"],
  },
  {
    title: "B2B SaaS Lead Generation",
    industry: "Technology",
    challenge: "A SaaS startup was struggling to generate qualified leads through digital channels, with high cost per acquisition and low conversion rates.",
    solution: "Developed LinkedIn thought leadership program, created gated content strategy, implemented marketing automation, and optimized landing pages.",
    results: [
      { metric: "180%", label: "More Leads" },
      { metric: "60%", label: "Lower CPL" },
      { metric: "35%", label: "Conversion Rate" },
      { metric: "890K", label: "Content Reach" },
    ],
    duration: "4 months",
    platforms: ["LinkedIn", "YouTube", "Website"],
  },
  {
    title: "Restaurant Chain Expansion",
    industry: "Food & Beverage",
    challenge: "A local restaurant wanted to expand beyond their area but lacked digital presence and brand recognition in new markets.",
    solution: "Built strong social media presence, implemented local SEO strategy, created viral video content, and managed review reputation.",
    results: [
      { metric: "5 New", label: "Locations Opened" },
      { metric: "400%", label: "Online Orders" },
      { metric: "4.8★", label: "Average Rating" },
      { metric: "2M+", label: "Video Views" },
    ],
    duration: "12 months",
    platforms: ["Instagram", "YouTube", "Google"],
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: TrendingUp, value: "340%", label: "Avg. Growth" },
  { icon: Target, value: "98%", label: "Client Retention" },
  { icon: Award, value: "50+", label: "Awards Won" },
];

const Testimonials = () => {
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
                Success Stories
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Real Results from <span className="text-primary">Real Clients</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover how we've helped businesses across industries achieve remarkable growth through strategic digital solutions.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-background rounded-xl border border-border/50">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what business leaders have to say about working with DigitalPro.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-2xl p-6 relative"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                      {testimonial.metric}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Case Studies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">In-Depth Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore detailed case studies showing our strategic approach and the measurable results we deliver.
              </p>
            </motion.div>

            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background rounded-2xl p-8 border border-border/50"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                      {study.industry}
                    </span>
                    <span className="text-sm text-muted-foreground">{study.duration}</span>
                    <div className="flex gap-2 ml-auto">
                      {study.platforms.map((platform, i) => (
                        <span key={i} className="bg-secondary text-xs px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{study.title}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">The Challenge</h4>
                      <p className="text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Our Solution</h4>
                      <p className="text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/50">
                    {study.results.map((result, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl font-bold text-success">{result.metric}</div>
                        <div className="text-sm text-muted-foreground">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-primary rounded-3xl p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Be Our Next Success Story?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses that have transformed their digital presence with DigitalPro.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/contact">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  View Our Services
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
