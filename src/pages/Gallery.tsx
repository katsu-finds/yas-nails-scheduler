import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NailCard from "@/components/NailCard";
import { serviceCategories, NailDesign } from "@/data/nailData";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('nail_designs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setDesigns(data.map(d => ({
          ...d,
          image: d.image_url || ""
        })) as NailDesign[]);
      }
      setLoading(false);
    };

    fetchDesigns();
  }, []);

  const filtered =
    activeCategory === "All"
      ? designs
      : designs.filter((d) => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-background bg-marble">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Nail Design Gallery
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Browse our collection and find your perfect style.
            </p>
          </motion.div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 rounded-full border-4 border-salon-blush border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No designs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((design, i) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NailCard design={design} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
