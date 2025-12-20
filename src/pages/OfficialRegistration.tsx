import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Star, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const OfficialRegistration = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-md"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Official UDYAM Registration
              </h1>

              <p className="text-muted-foreground text-lg">
                NEXBYTE DIGITAL AND TECHNOLOGY SERVICES is a Government of India
                registered Micro Enterprise.
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>

            {/* Enterprise Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-secondary/20 p-6 rounded-xl border border-border/50">
                <h3 className="font-semibold text-lg mb-4">Enterprise Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><b>Name:</b> NEXBYTE DIGITAL AND TECHNOLOGY SERVICES</li>
                  <li><b>UDYAM No:</b> UDYAM-TS-24-0026708</li>
                  <li><b>Type:</b> Micro Enterprise</li>
                  <li><b>Major Activity:</b> Services</li>
                  <li><b>Registration Date:</b> 18/12/2025</li>
                  <li><b>Commencement Date:</b> 17/12/2025</li>
                </ul>
              </div>

              <div className="bg-secondary/20 p-6 rounded-xl border border-border/50">
                <h3 className="font-semibold text-lg mb-4">NIC Classification</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><b>NIC 2 Digit:</b> 62 – Computer programming & consultancy</li>
                  <li><b>NIC 4 Digit:</b> 6209 – IT & computer services</li>
                  <li><b>NIC 5 Digit:</b> 62099 – IT services n.e.c</li>
                  <li><b>Classification Year:</b> 2025–26</li>
                </ul>
              </div>
            </div>

            {/* Address & Contact */}
            <div className="bg-secondary/10 p-6 rounded-xl border border-border/50 mb-10">
              <h3 className="font-semibold text-lg mb-4">Official Address & Contact</h3>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  Flat No 12-10-150, Venkampeta, Venkampet Road,  
                  Sircilla, Rajanna Sircilla – 505301, Telangana
                </p>

                <p className="flex gap-2 items-center">
                  <Phone className="w-4 h-4 text-primary" />
                  +91 8247872473
                </p>

                <p className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-primary" />
                  gundaloki0@gmail.com
                </p>
              </div>
            </div>

            {/* Certificate CTA */}
            <div className="text-center">
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 mb-6">
                <h3 className="font-semibold text-lg mb-2">
                  UDYAM Registration Certificate
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click below to view the official government-issued PDF certificate.
                </p>
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/12ymj-wIA9L9pWsX5b3eiRFmkJ87TSoDi/view?usp=sharing",
                    "_blank"
                  )
                }
              >
                View Certificate <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfficialRegistration;
