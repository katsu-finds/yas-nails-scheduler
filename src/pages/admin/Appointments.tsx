import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });
    if (error) toast.error(error.message);
    else setAppointments((data as Appointment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    }
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "default";
    if (s === "cancelled") return "destructive";
    return "secondary";
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Appointment Management</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted-foreground">No appointments yet.</p>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium">{a.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{a.customer_phone}</div>
                  </TableCell>
                  <TableCell>{format(new Date(a.appointment_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{a.appointment_time}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(a.status)}>{a.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select onValueChange={(v) => updateStatus(a.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                        <SelectItem value="completed">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
