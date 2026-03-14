import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  reference_number: string;
  status: string;
  created_at: string;
  appointment_id: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPayments((data as Payment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("payments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Payment marked ${status}`); fetchPayments(); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Payment Records</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No payment records yet.</p>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.reference_number || "—"}</TableCell>
                  <TableCell className="font-semibold">₱{p.amount}</TableCell>
                  <TableCell className="capitalize">{p.payment_method}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "paid" ? "default" : "secondary"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Select onValueChange={(v) => updateStatus(p.id, v)}>
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
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
