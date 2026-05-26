import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth"; 

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function Notifications() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/notifications/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setList(data.reverse());
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("History load nahi ho payi");
        setIsLoading(false);
      });
  }, []);

  const send = async () => {
    if (!title || !msg) return toast.error("Bhai, Title aur Message dono likho!");
    setIsSending(true);

    try {
      const res = await fetch(`${API_URL}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message: msg })
      });

      if (res.ok) {
        const newNotif = await res.json();
        setList([newNotif, ...list]);
        setTitle(""); setMsg(""); 
        toast.success(`Notification sent to ${newNotif.recipients || 0} users! 🚀`);
      } else {
        toast.error("Bhejne mein error aayi!");
      }
    } catch (err) {
      toast.error("Server connection failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Notifications" 
        description={isAdmin ? "सभी यूज़र्स को इन-ऐप नोटिफिकेशन भेजें" : "एडमिन के निर्देश और अलर्ट्स"} 
      />
      {/* 👉 FIX: Mobile me flex-col se ek ke niche ek aayega, PC me grid (1/3 aur 2/3) */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
        
        {/* Left Side: Send Form (SIRF ADMIN KE LIYE) */}
        {isAdmin && (
          <Card className="shadow-card lg:col-span-1 order-1">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Bell className="h-5 w-5 text-primary" /> Send New
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="ब्रेकिंग न्यूज़" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="संदेश..." className="min-h-[120px]" />
              </div>
              <Button className="w-full gradient-primary" onClick={send} disabled={isSending}>
                {isSending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />} 
                {isSending ? "Sending..." : "Send to All"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Right Side: Sent History */}
        <Card className={`shadow-card ${isAdmin ? "lg:col-span-2 order-2" : "lg:col-span-3 order-1"}`}>
          <CardContent className="p-4">
            <h3 className="mb-3 px-2 text-lg font-bold">{isAdmin ? "Sent History" : "Alerts"}</h3>
            <div className="overflow-x-auto w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Sent At</TableHead>
                    {isAdmin && <TableHead className="hidden sm:table-cell text-right">Recipients</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                  ) : list.length === 0 ? (
                     <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No notifications.</TableCell></TableRow>
                  ) : (
                    list.map(n => (
                      <TableRow key={n.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">{n.message}</p>
                            {/* Mobile only date */}
                            <p className="text-[10px] text-muted-foreground mt-1 sm:hidden">
                              {n.sentAt ? new Date(n.sentAt).toLocaleString() : "Just now"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                          {n.sentAt ? new Date(n.sentAt).toLocaleString() : "Just now"}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="hidden sm:table-cell text-right font-medium text-primary">
                            {n.recipients ? n.recipients.toLocaleString() : 0}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}