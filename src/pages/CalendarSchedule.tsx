import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM",
];

const CalendarSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  useEffect(() => {
    const fetchData = async () => {
      // Fetch closed dates
      const { data: closedData } = await supabase
        .from("closed_dates")
        .select("date");
      if (closedData) setClosedDates(closedData.map((r) => r.date));

      // Fetch booked appointments
      const { data: apptData } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time");
      if (apptData) {
        const slots: Record<string, string[]> = {};
        apptData.forEach(({ appointment_date, appointment_time }) => {
          if (!slots[appointment_date]) slots[appointment_date] = [];
          slots[appointment_date].push(appointment_time);
        });
        setBookedSlots(slots);
      }
    };
    fetchData();
  }, []);

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;

  const booked = selectedDateStr ? bookedSlots[selectedDateStr] || [] : [];
  const isSelectedClosed = selectedDateStr ? closedDates.includes(selectedDateStr) : false;

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

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-salon-blush inline-block" />
              Has bookings
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-destructive/30 inline-block" />
              Closed / Unavailable
            </span>
          </div>

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
                const isClosed = closedDates.includes(dateStr);
                const hasBookings = !!bookedSlots[dateStr];
                const isSelected = selectedDay === day;
                const today = new Date();
                const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                  <button
                    key={day}
                    onClick={() => !isClosed && setSelectedDay(day)}
                    disabled={isClosed || isPast}
                    title={isClosed ? "Not available" : undefined}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                      ${isClosed ? "bg-destructive/20 text-destructive line-through cursor-not-allowed opacity-70" : ""}
                      ${isPast && !isClosed ? "opacity-30 cursor-not-allowed" : ""}
                      ${isSelected && !isClosed ? "bg-primary text-primary-foreground shadow-soft" : ""}
                      ${!isClosed && !isPast && !isSelected ? "hover:bg-muted text-foreground" : ""}
                    `}
                  >
                    {day}
                    {hasBookings && !isClosed && (
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
                {isSelectedClosed ? (
                  <p className="text-destructive font-medium text-center py-4">
                    ❌ This date is closed for bookings.
                  </p>
                ) : (
                  <>
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
                  </>
                )}
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
