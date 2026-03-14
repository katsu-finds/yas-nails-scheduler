import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface NailDesign {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
}

const categories = ["Acrylic Nails", "Gel Nails", "Nail Art", "French Tips", "Custom Designs"];

export default function GalleryManagement() {
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", category: "Acrylic Nails", description: "", price: "", image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDesigns = async () => {
    const { data } = await supabase.from("nail_designs").select("*").order("created_at", { ascending: false });
    setDesigns((data as NailDesign[]) ?? []);
  };

  useEffect(() => { fetchDesigns(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return toast.error("Name and price are required");
    setUploading(true);

    let image_url = form.image_url;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("nail-designs").upload(path, imageFile);
      if (uploadError) { toast.error(uploadError.message); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("nail-designs").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    if (isEditing) {
      const { error } = await supabase.from("nail_designs").update({
        name: form.name,
        category: form.category,
        description: form.description,
        price: parseInt(form.price),
        image_url,
      }).eq("id", form.id);

      if (error) toast.error(error.message);
      else {
        toast.success("Design updated!");
        resetForm();
        fetchDesigns();
      }
    } else {
      const { error } = await supabase.from("nail_designs").insert({
        name: form.name,
        category: form.category,
        description: form.description,
        price: parseInt(form.price),
        image_url,
      });

      if (error) toast.error(error.message);
      else {
        toast.success("Design added!");
        resetForm();
        fetchDesigns();
      }
    }
    setUploading(false);
  };

  const resetForm = () => {
    setOpen(false);
    setIsEditing(false);
    setForm({ id: "", name: "", category: "Acrylic Nails", description: "", price: "", image_url: "" });
    setImageFile(null);
  };

  const openEdit = (design: NailDesign) => {
    setForm({
      id: design.id,
      name: design.name,
      category: design.category,
      description: design.description,
      price: String(design.price),
      image_url: design.image_url || "",
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("nail_designs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetchDesigns(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Gallery Management</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => { resetForm(); setOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Design</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{isEditing ? "Edit" : "Add"} Nail Design</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Design name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Price (₱)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              <Button variant="hero" className="w-full" onClick={handleSubmit} disabled={uploading}>
                {uploading ? (isEditing ? "Updating..." : "Uploading...") : (isEditing ? "Update Design" : "Add Design")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {designs.length === 0 ? (
        <p className="text-muted-foreground">No designs yet. Add your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((d) => (
            <Card key={d.id} className="overflow-hidden">
              {d.image_url && (
                <img src={d.image_url} alt={d.name} className="w-full h-48 object-cover" />
              )}
              <CardContent className="p-4">
                <h3 className="font-display font-semibold text-foreground">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.category}</p>
                <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-foreground">₱{d.price}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
