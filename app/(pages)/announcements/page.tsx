import AnnouncementsModule from "@/modules/announcements/announcementsModule";
import Navbar from "@/components/layout/navbar"; 
import Footer from "@/components/layout/footer"; 
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AnnouncementsModule />
            <ChatbotWidget />
      <Footer />
    </>
  );
}
