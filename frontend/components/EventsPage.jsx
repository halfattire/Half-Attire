import EventCard from "../components/EventCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header"; 
import NewsLetter from "@/components/NewsLetter"; 

function EventsPage() {
  return (
    <div>
      <Header />
      <EventCard />
      <NewsLetter />
      <Footer />
    </div>
  );
}

export default EventsPage;