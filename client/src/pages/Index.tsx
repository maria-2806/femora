import Navigation from '@/components/Navigation';
import Hero from '@/components/landing/Hero';
import UltrasoundUpload from '@/components/landing/UltrasoundUpload';
import PeriodTracker from '@/components/landing/PeriodTracker';
import AIChat from '@/components/landing/AIChat';
import Features from '@/components/landing/Features';
const Index = () => {
  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <Hero />
       <Features />
      <UltrasoundUpload />
      <PeriodTracker />
      <AIChat />
    </div>
  );
};

export default Index;
