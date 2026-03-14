import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shield, ShieldOff } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [profileRes, roleRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles((profileRes.data as Profile[]) ?? []);
    setRoles((roleRes.data as UserRole[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (userId: string) => {
    const r = roles.find((r) => r.user_id === userId);
    return r?.role ?? "user";
  };

  const toggleAdmin = async (userId: string) => {
    const currentRole = getUserRole(userId);
    if (currentRole === "admin") {
      // Remove admin role, they keep 'user' role
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Admin role removed");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast.success("Admin role granted");
    }
    fetchData();
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">User Management</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : profiles.length === 0 ? (
        <p className="text-muted-foreground">No registered users yet.</p>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                  <TableCell>{p.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={getUserRole(p.id) === "admin" ? "default" : "secondary"}>
                      {getUserRole(p.id)}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdmin(p.id)}
                    >
                      {getUserRole(p.id) === "admin" ? (
                        <><ShieldOff className="mr-1 h-4 w-4" />Remove Admin</>
                      ) : (
                        <><Shield className="mr-1 h-4 w-4" />Make Admin</>
                      )}
                    </Button>
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
