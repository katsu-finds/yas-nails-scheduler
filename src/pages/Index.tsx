import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Image, CreditCard } from "lucide-react";
import heroImage from "@/assets/hero-nails.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    desc: "Pick your date and time with our real-time calendar.",
  },
  {
    icon: Image,
    title: "Nail Gallery",
    desc: "Browse stunning designs before your appointment.",
  },
  {
    icon: CreditCard,
    title: "GCash Payment",
    desc: "Secure your reservation with hassle-free GCash payment.",
  },
  {
    icon: Sparkles,
    title: "Custom Designs",
    desc: "Send your inspo and get a unique custom look.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-marble">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <span className="inline-block text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Premium Nail Salon
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Yas Nails:
              <br />
              <span className="text-salon-blush">Slay All Day</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Elevate your style with stunning nail art, gel sets, and luxury
              manicures. Book your appointment today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/book">
                <Button variant="hero" size="xl">
                  Book Now
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="xl">
                  View Gallery
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Luxury nail salon products on marble"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Why Choose Yas Nails?
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              A seamless salon experience from browsing to booking.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow duration-300 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/40 flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-10 md:p-16 text-center shadow-card">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Ready to Slay?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Pick your perfect nail design and book your slot today.
            </p>
            <Link to="/book" className="mt-8 inline-block">
              <Button variant="hero" size="xl">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
