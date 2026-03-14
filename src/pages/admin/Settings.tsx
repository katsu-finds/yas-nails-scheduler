import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Settings() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      // @ts-ignore
      const { data, error } = await supabase
        .from("site_settings")
        .select("booking_prompt")
        .eq("id", "default")
        .single();
      
      if (!error && data) {
        setPrompt(data.booking_prompt);
      }
      setLoading(false);
    };

    fetchSettings();
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

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings updated successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Settings</h2>
      </div>

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
    </div>
  );
}
