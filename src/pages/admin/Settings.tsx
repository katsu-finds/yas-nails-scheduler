import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";

export default function Settings() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("booking_prompt")
        .eq("id", "default")
        .single();

      if (settingsData) setPrompt(settingsData.booking_prompt);

      const { data: closedData } = await supabase
        .from("closed_dates")
        .select("date")
        .order("date");

      if (closedData) setClosedDates(closedData.map((r) => r.date));

      setLoading(false);
    };

    fetchAll();
  }, []);

  const handleSave = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ booking_prompt: prompt })
      .eq("id", "default");
    if (error) toast.error(error.message);
    else toast.success("Settings updated successfully!");
    setSaving(false);
  };

  const handleToggleDate = async (day: Date | undefined) => {
    if (!day) return;
    setSelectedDate(day);
    const dateStr = format(day, "yyyy-MM-dd");

    if (closedDates.includes(dateStr)) {
      // Re-open date
      const { error } = await supabase.from("closed_dates").delete().eq("date", dateStr);
      if (error) toast.error(error.message);
      else {
        setClosedDates((prev) => prev.filter((d) => d !== dateStr));
        toast.success(`${format(day, "MMMM d, yyyy")} is now open for bookings.`);
      }
    } else {
      // Close date
      const { error } = await supabase.from("closed_dates").insert({ date: dateStr });
      if (error) toast.error(error.message);
      else {
        setClosedDates((prev) => [...prev, dateStr]);
        toast.success(`${format(day, "MMMM d, yyyy")} is now closed for bookings.`);
      }
    }
    setSelectedDate(undefined);
  };

  const removeClosed = async (dateStr: string) => {
    const { error } = await supabase.from("closed_dates").delete().eq("date", dateStr);
    if (error) toast.error(error.message);
    else {
      setClosedDates((prev) => prev.filter((d) => d !== dateStr));
      toast.success("Date re-opened.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Settings</h2>
      </div>

      {/* Booking Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Instructions</CardTitle>
          <CardDescription>
            This text will be displayed at the top of the "Book Your Appointment" page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Follow the steps below to reserve your slot."
            className="min-h-[100px]"
          />
          <Button variant="hero" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Availability Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Availability</CardTitle>
          <CardDescription>
            Click a date to mark it as <strong>closed</strong>. Click again to re-open it.
            Closed dates will be greyed out for customers during booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleToggleDate}
              disabled={{ before: new Date() }}
              modifiers={{
                closed: closedDates.map((d) => parseISO(d)),
              }}
              modifiersClassNames={{
                closed: "bg-destructive/20 text-destructive line-through rounded-md",
              }}
              className="rounded-lg border shadow-soft"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-3">Currently Closed Dates</h4>
              {closedDates.length === 0 ? (
                <p className="text-muted-foreground text-sm">No dates are blocked. All upcoming dates are open for booking.</p>
              ) : (
                <ul className="space-y-2">
                  {closedDates.map((d) => (
                    <li key={d} className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-foreground">
                        {format(parseISO(d), "MMMM d, yyyy")}
                      </span>
                      <button
                        onClick={() => removeClosed(d)}
                        className="text-destructive hover:text-destructive/70 ml-2"
                        title="Re-open this date"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
