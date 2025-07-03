import Navigation from '@/components/Navigation';
import Hero from '@/components/landing/Hero';
import MRIUpload from '@/components/landing/MRIUpload';
import PeriodTracker from '@/components/landing/PeriodTracker';
import AIChat from '@/components/landing/AIChat';
import Features from '@/components/landing/Features';
const Index = () => {
  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <Hero />
       <Features />
      <MRIUpload />
      <PeriodTracker />
      <AIChat />
    </div>
  );
};

export default Index;
