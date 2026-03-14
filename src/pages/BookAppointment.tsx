import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NailCard from "@/components/NailCard";
import { timeSlots, NailDesign } from "@/data/nailData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [bookingPrompt, setBookingPrompt] = useState("Follow the steps below to reserve your slot.");
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch settings
      // @ts-ignore
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('booking_prompt')
        .eq('id', 'default')
        .single();
      
      if (settingsData && settingsData.booking_prompt) {
        setBookingPrompt(settingsData.booking_prompt);
      }

      // Fetch nail designs
      const { data: designsData } = await supabase
        .from('nail_designs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (designsData) {
        setDesigns(designsData.map(d => ({
          ...d,
          image: d.image_url || ""
        })) as NailDesign[]);
      }

      // Fetch closed dates
      const { data: closedData } = await supabase.from('closed_dates').select('date');
      if (closedData) setClosedDates(closedData.map(r => r.date));

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleConfirm = () => {
    if (!selectedDesign || !selectedDate || !selectedTime || !name) {
      toast.error("Please complete all fields");
      return;
    }
    setStep(4);
    toast.success("Booking submitted! Please pay via GCash to confirm.");
  };

  return (
    <div className="min-h-screen bg-background bg-marble">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Book Your Appointment
            </h1>
            <p className="text-muted-foreground mt-3">
              {bookingPrompt}
            </p>
          </motion.div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {["Select Design", "Pick Date & Time", "Your Details", "Confirm"].map(
              (label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step > i + 1
                        ? "bg-salon-blush text-foreground"
                        : step === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  {i < 3 && (
                    <div
                      className={`hidden sm:block w-12 h-0.5 ${
                        step > i + 1 ? "bg-salon-blush" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>

          {/* Step 1: Select Design */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="h-8 w-8 rounded-full border-4 border-salon-blush border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">Loading designs...</p>
                </div>
              ) : designs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No designs available at the moment.</p>
                </div>
              ) : (
                designs.map((d) => (
                  <NailCard
                    key={d.id}
                    design={d}
                    onSelect={(design) => {
                      setSelectedDesign(design);
                      setStep(2);
                    }}
                  />
                ))
              )}
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl p-8 shadow-soft"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-salon-blush" />
                Select Date & Time
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const dateStr = e.target.value;
                    if (closedDates.includes(dateStr)) {
                      toast.error("Sorry, this date is not available for booking. Please choose another date.");
                    } else {
                      setSelectedDate(dateStr);
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  onClick={() => {
                    if (!selectedDate || !selectedTime) {
                      toast.error("Please select date and time");
                      return;
                    }
                    setStep(3);
                  }}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl p-8 shadow-soft max-w-lg mx-auto"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl bg-muted">
                <h3 className="font-display font-semibold text-foreground text-sm mb-2">
                  Booking Summary
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Design: {selectedDesign?.name}</p>
                  <p>Date: {selectedDate}</p>
                  <p>Time: {selectedTime}</p>
                  <p className="font-semibold text-foreground">
                    Total: ₱{selectedDesign?.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="hero" onClick={handleConfirm}>
                  Confirm & Pay via GCash
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl p-10 shadow-card max-w-lg mx-auto text-center"
            >
              <CheckCircle className="h-16 w-16 text-salon-blush mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold text-foreground">
                Booking Submitted!
              </h2>
              <p className="text-muted-foreground mt-3">
                Please send your reservation fee via GCash to confirm your slot. We'll send a confirmation once payment is verified.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-muted text-left text-sm space-y-1">
                <p><span className="font-medium text-foreground">Design:</span> {selectedDesign?.name}</p>
                <p><span className="font-medium text-foreground">Date:</span> {selectedDate}</p>
                <p><span className="font-medium text-foreground">Time:</span> {selectedTime}</p>
                <p><span className="font-medium text-foreground">Name:</span> {name}</p>
                <p><span className="font-medium text-foreground">Total:</span> ₱{selectedDesign?.price.toLocaleString()}</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-salon-lavender/30 text-sm">
                <p className="font-display font-semibold text-foreground">GCash Payment</p>
                <p className="text-muted-foreground mt-1">
                  Send ₱500 reservation fee to <span className="font-semibold">0912-345-6789</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Include your booking name as reference
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointment;
