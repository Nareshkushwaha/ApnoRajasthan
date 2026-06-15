import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Reply, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

export default function Messages() {
  const [list, setList] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/all`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.reverse(); 
        setList(sorted);
        if (sorted.length > 0 && !active) setActive(sorted[0]);
      }
    } catch (err) {
      toast.error("Messages load nahi ho paye");
    } finally {
      setLoading(false);
    }
  };

  const open = async (m: any) => {
    setActive(m);
    if (!m.read) {
        try {
            await fetch(`${API_BASE_URL}/api/messages/read/${m.id}`, { method: "PUT" });
            setList(list.map(x => x.id === m.id ? { ...x, read: true } : x));
        } catch (err) {
            console.error("Read status update failed");
        }
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <PageHeader 
        title="Contact Messages" 
        description={list.length > 0 ? `${list.filter(m => !m.read).length} unread messages` : "No messages yet"} 
      />
      
      {list.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground shadow-card w-full">
          Aapko abhi tak koi message nahi mila hai.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 w-full">
          
          <Card className="shadow-card lg:col-span-1 h-[400px] lg:h-[600px] overflow-y-auto order-last lg:order-first w-full">
            <CardContent className="p-2">
              {list.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => open(m)} 
                  className={`flex w-full gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted ${active?.id === m.id ? "bg-muted" : ""}`}
                >
                  {m.read ? <MailOpen className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" /> : <Mail className="h-4 w-4 mt-1 shrink-0 text-primary" />}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex justify-between gap-2">
                      <p className={`truncate text-sm ${!m.read && "font-bold"}`}>{m.name}</p>
                      {!m.read && <Badge className="h-2 w-2 shrink-0 rounded-full bg-primary p-0" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.subject || "No Subject"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString('hi-IN') : "Just now"}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {active && (
            <Card className="shadow-card lg:col-span-2 order-first lg:order-last w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6 w-full">
                <div className="mb-4 w-full">
                  <h2 className="text-lg sm:text-xl font-bold break-words">{active.subject || "No Subject"}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                    From <span className="font-medium text-foreground">{active.name}</span> · {active.email} 
                    <br />
                    Received: {active.createdAt ? new Date(active.createdAt).toLocaleString('hi-IN') : "Recently"}
                  </p>
                </div>
                
                <div className="rounded-md border bg-muted/30 p-4 text-sm min-h-[150px] whitespace-pre-wrap break-words overflow-x-hidden w-full">
                  {active.message}
                </div>

                <div className="mt-6 space-y-2 border-t pt-4 w-full">
                  <label className="text-sm font-medium">Reply to Sender</label>
                  <Textarea 
                    value={reply} 
                    onChange={e => setReply(e.target.value)} 
                    placeholder="अपना उत्तर लिखें..." 
                    className="min-h-[100px] sm:min-h-[120px] w-full" 
                  />
                  <div className="flex justify-end">
                    <Button 
                        className="gradient-primary" 
                        onClick={() => { toast.success(`Reply sent to ${active.email}`); setReply(""); }}
                        disabled={!reply.trim()}
                    >
                        <Reply className="mr-1 h-4 w-4" /> Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}