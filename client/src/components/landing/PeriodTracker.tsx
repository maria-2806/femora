import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, TrendingUp, Moon, Droplets } from 'lucide-react';

const PeriodTracker = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateString,
        isSelected: selectedDates.includes(dateString),
        isPredicted: false // You can add prediction logic here
      });
    }
    
    return days;
  };

  const toggleDate = (dateString: string) => {
    setSelectedDates(prev => 
      prev.includes(dateString) 
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString]
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Mock cycle insights
  const cycleLength = 28;
  const lastPeriod = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;

  return (
    <section id="tracker" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Period</span> Tracking
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your menstrual cycle and gain insights into your reproductive health
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant border-border/50 animate-slide-in-right">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{monthYear}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                    >
                      ←
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                    >
                      →
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Click on dates to mark your period days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayData, index) => (
                    <div key={index} className="aspect-square">
                      {dayData ? (
                        <button
                          onClick={() => toggleDate(dayData.dateString)}
                          className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            dayData.isSelected
                              ? 'bg-gradient-primary text-primary-foreground shadow-soft'
                              : 'hover:bg-muted border border-transparent hover:border-border'
                          }`}
                        >
                          {dayData.day}
                        </button>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-primary rounded"></div>
                    <span>Period Days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <span>Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-accent rounded"></div>
                    <span>Fertile Window</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            {/* Cycle Overview */}
            <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>Cycle Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Cycle</span>
                  <span className="font-semibold">{cycleLength} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Period</span>
                  <span className="font-semibold">
                    {lastPeriod ? new Date(lastPeriod).toLocaleDateString() : 'Not tracked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Predicted</span>
                  <span className="font-semibold text-primary">Dec 15</span>
                </div>
              </CardContent>
            </Card>

            {/* Health Insights */}
            <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Health Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-2 text-success-foreground">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Regular Cycle Pattern</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your cycle is consistently within the normal range
                  </p>
                </div>

                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center space-x-2 text-warning-foreground">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm font-medium">Track Symptoms</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider logging mood and physical symptoms
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Droplets className="w-4 h-4 mr-2" />
                  Log Symptoms
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="feminine" size="sm" className="w-full">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeriodTracker;