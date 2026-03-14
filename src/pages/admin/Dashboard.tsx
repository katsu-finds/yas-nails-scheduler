import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CreditCard, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ appointments: 0, users: 0, payments: 0, designs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [appts, profiles, payments, designs] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("id", { count: "exact", head: true }),
        supabase.from("nail_designs").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        appointments: appts.count ?? 0,
        users: profiles.count ?? 0,
        payments: payments.count ?? 0,
        designs: designs.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Appointments", value: stats.appointments, icon: CalendarDays, color: "text-salon-blush" },
    { label: "Users", value: stats.users, icon: Users, color: "text-salon-lavender" },
    { label: "Payments", value: stats.payments, icon: CreditCard, color: "text-primary" },
    { label: "Nail Designs", value: stats.designs, icon: Image, color: "text-accent" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
