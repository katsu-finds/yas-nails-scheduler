import { motion } from "framer-motion";
import { NailDesign } from "@/data/nailData";

interface NailCardProps {
  design: NailDesign;
  onSelect?: (design: NailDesign) => void;
}

const NailCard = ({ design, onSelect }: NailCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect?.(design)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={design.image}
          alt={design.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          {design.category}
        </span>
        <h3 className="font-display text-lg font-semibold text-foreground mt-1">
          {design.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {design.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-foreground">
            ₱{design.price.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-salon-blush group-hover:text-foreground transition-colors">
            Select →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NailCard;
