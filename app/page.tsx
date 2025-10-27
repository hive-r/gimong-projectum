import HomeModule from "@/modules/home/homeModule";
import Navbar from "@/components/layout/navbar"; 
import Footer from "@/components/layout/footer"; 
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function Page() {
  return (
    <>
      <Navbar />
      <HomeModule />
      <Footer />
      <ChatbotWidget />
    </>
  );
}

