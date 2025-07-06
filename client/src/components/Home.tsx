import React from 'react';
import Navigation from './Navigation';
const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
            Your Health Dashboard
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <h3 className="font-semibold mb-2">Recent Scans</h3>
              <p className="text-muted-foreground text-sm">View your latest MRI analysis results</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <h3 className="font-semibold mb-2">Period Insights</h3>
              <p className="text-muted-foreground text-sm">Track your menstrual cycle patterns</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-soft">
              <h3 className="font-semibold mb-2">Health Summary</h3>
              <p className="text-muted-foreground text-sm">Get AI-powered health recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;