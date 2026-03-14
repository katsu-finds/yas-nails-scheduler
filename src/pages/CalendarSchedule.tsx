import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Mock booked slots
const bookedSlots: Record<string, string[]> = {
  "2026-03-15": ["9:00 AM", "10:00 AM", "2:00 PM"],
  "2026-03-16": ["11:00 AM", "1:00 PM"],
  "2026-03-18": ["9:30 AM", "3:00 PM", "4:00 PM"],
};

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM",
];

const CalendarSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2)); // March 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;

  const booked = selectedDateStr ? bookedSlots[selectedDateStr] || [] : [];

  return (
    <div className="min-h-screen bg-background bg-marble">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Appointment Calendar
            </h1>
            <p className="text-muted-foreground mt-3">
              View available slots in real time.
            </p>
          </motion.div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <h2 className="font-display text-xl font-semibold text-foreground">{monthName}</h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasBookings = bookedSlots[dateStr];
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {day}
                    {hasBookings && (
                      <span className="w-1.5 h-1.5 rounded-full bg-salon-blush mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-border"
              >
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Slots for {monthName.split(" ")[0]} {selectedDay}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => {
                    const isBooked = booked.includes(slot);
                    return (
                      <div
                        key={slot}
                        className={`py-2 px-3 rounded-xl text-sm text-center font-medium ${
                          isBooked
                            ? "bg-muted text-muted-foreground line-through opacity-50"
                            : "bg-salon-lavender/20 text-foreground"
                        }`}
                      >
                        {slot}
                        {isBooked && (
                          <span className="block text-[10px] mt-0.5">Booked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarSchedule;
