import AboutModule from "@/modules/about/aboutModule";
import Navbar from "@/components/layout/navbar"; 
import Footer from "@/components/layout/footer"; 
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutModule />
            <ChatbotWidget />
      <Footer />
    </>
  );
}
