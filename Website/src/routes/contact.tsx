import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("कृपया सभी ज़रूरी जानकारी भरें!");
      return;
    }

    setLoading(true);
    try {
      // 👉 BADAAL: URL ko update kar diya hai backend ke hisaab se
      const res = await fetch(`${API_BASE_URL}/api/messages/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("आपका संदेश सफलतापूर्वक भेज दिया गया है!");
        setFormData({ name: "", email: "", subject: "", message: "" }); 
      } else {
        toast.error("संदेश भेजने में समस्या आई।");
      }
    } catch (error) {
      toast.error("सर्वर से जुड़ नहीं पाए!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-[60vh]">
      <div className="bg-ink text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">हमसे जुड़ें</h1>
          <p className="text-white/70">आपकी राय, सुझाव और ख़बरें — सब आपका स्वागत है।</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">संदेश भेजें</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">नाम</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="आपका नाम"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">ईमेल</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="आपका ईमेल"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">विषय</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="संदेश का विषय"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">संदेश</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md min-h-[150px] resize-none"
                placeholder="अपना संदेश यहाँ लिखें..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md hover:opacity-90 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : null} संदेश भेजें
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><MapPin /></div>
            <div>
              <h3 className="font-bold">मुख्यालय</h3>
              <p className="text-sm text-muted-foreground mt-1">अपनो राजस्थान मीडिया हाउस,<br />एम.आई. रोड, जयपुर — 302001</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Phone /></div>
            <div>
              <h3 className="font-bold">फोन</h3>
              <p className="text-sm text-muted-foreground mt-1">+91 141 4000 100</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Mail /></div>
            <div>
              <h3 className="font-bold">ईमेल</h3>
              <p className="text-sm text-muted-foreground mt-1">news@apnorajasthan.in</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Clock /></div>
            <div>
              <h3 className="font-bold">न्यूज़ डेस्क</h3>
              <p className="text-sm text-muted-foreground mt-1">24x7 सेवा उपलब्ध</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}