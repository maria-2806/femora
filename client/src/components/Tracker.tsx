import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, TrendingUp, Moon, Droplets } from 'lucide-react';
import { auth, db } from '@/firebaseConfig';
import { collection, doc, getDocs, setDoc, query, where, Timestamp } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';



const Tracker = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [predictedDate, setPredictedDate] = useState<Date | null>(null);
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [fertileDates, setFertileDates] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const periodLength = 5;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const q = query(
          collection(db, 'users', user.uid, 'periods'),
          where('timestamp', '>=', Timestamp.fromDate(sixMonthsAgo))
        );

        const querySnapshot = await getDocs(q);
        const fetchedDates: string[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.date) fetchedDates.push(data.date);
        });

        setSelectedDates(fetchedDates);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (selectedDates.length < 2) return;

  // Step 1: Sort dates and convert to Date objects
  const sortedDates = [...selectedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const parsedDates = sortedDates.map(date => new Date(date));

  // Step 2: Group dates into periods (gap > 10 days = new period)
  const periodStarts: Date[] = [parsedDates[0]];
  for (let i = 1; i < parsedDates.length; i++) {
    const diff = (parsedDates[i].getTime() - parsedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 10) {
      periodStarts.push(parsedDates[i]);
    }
  }

  if (periodStarts.length < 2) return;

  const cycleLengths: number[] = [];
  for (let i = 1; i < periodStarts.length; i++) {
    const diff = (periodStarts[i].getTime() - periodStarts[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    cycleLengths.push(diff);
  }

  const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);

  const lastPeriodStart = periodStarts[periodStarts.length - 1];

  const nextStart = new Date(lastPeriodStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);
  setPredictedDate(nextStart);

  const ovulation = new Date(nextStart);
  ovulation.setDate(nextStart.getDate() - 14);
  setOvulationDate(ovulation);
}, [selectedDates]);

useEffect(() => {
  if (!ovulationDate) return;

  const fertile: string[] = [];
  for (let i = 0; i <= 5; i++) {
    const fertileDay = new Date(ovulationDate);
    fertileDay.setDate(ovulationDate.getDate() - i);
    fertile.push(fertileDay.toISOString().split('T')[0]);
  }
  setFertileDates(fertile);
}, [ovulationDate]);


  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDates.includes(dateString);

      const thisDate = new Date(dateString);

      const isPredictedMonth =
        predictedDate &&
        predictedDate.getFullYear() === currentMonth.getFullYear() &&
        predictedDate.getMonth() === currentMonth.getMonth();

      const isOvulationMonth =
        ovulationDate &&
        ovulationDate.getFullYear() === currentMonth.getFullYear() &&
        ovulationDate.getMonth() === currentMonth.getMonth();

      let isPredicted = false;
      let isPredictedRange = false;
      let isOvulation = false;

      if (predictedDate && isPredictedMonth) {
        const predictedRange = Array.from({ length: periodLength }, (_, i) => {
          const d = new Date(predictedDate);
          d.setDate(d.getDate() + i);
          return d.toDateString();
        });

        isPredicted = predictedDate.toDateString() === thisDate.toDateString();
        isPredictedRange = predictedRange.includes(thisDate.toDateString());
      }

      if (ovulationDate && isOvulationMonth) {
        isOvulation = ovulationDate.toDateString() === thisDate.toDateString();
      }

      const isFertile = fertileDates.includes(dateString);

      days.push({
        day,
        dateString,
        isSelected,
        isPredicted,
        isOvulation,
        isPredictedRange,
        isFertile,
      });
    }

    return days;
  };


  const toggleDate = async (dateString: string) => {
    if (!uid) return;

    const docRef = doc(db, 'users', uid, 'periods', dateString);

    if (selectedDates.includes(dateString)) {
      setSelectedDates(prev => prev.filter(d => d !== dateString));
      await deleteDoc(docRef);
    } else {
      setSelectedDates(prev => [...prev, dateString]);
      await setDoc(docRef, {
        date: dateString,
        timestamp: Timestamp.fromDate(new Date(dateString)),
      });
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const lastPeriod = selectedDates.length ? selectedDates[selectedDates.length - 1] : null;

  return (
    <section id="tracker" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-5 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-1">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Period</span> Tracking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your menstrual cycle and gain insights into your reproductive health
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 ">
            <Card className="shadow-elegant border-border/50 animate-slide-in-right">
              <CardHeader>
                <div className="flex items-center justify-between ">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{monthYear}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>←</Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>→</Button>
                  </div>
                </div>
                <CardDescription>Click on dates to mark your period days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayData, index) => (
                    <div key={index} className="aspect-square">
                      {dayData ? (
                        <button
                          onClick={() => toggleDate(dayData.dateString)}
                          className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${dayData.isSelected
                              ? 'bg-gradient-primary text-white shadow-soft' :
                              dayData.isPredictedRange ? 'bg-blue-100 text-blue-700'
                                : dayData.isFertile
                                  ? 'bg-accent text-white'
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
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-primary rounded"></div>
                    <span>Period Days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
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

          <div className="space-y-6">
            <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className='text-xl'>Cycle Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Period</span>
                  <span className="font-semibold">
                    {lastPeriod ? new Date(lastPeriod).toLocaleDateString() : 'Not tracked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Predicted</span>
                  <span className="font-semibold text-primary">
                    {predictedDate ? predictedDate.toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ovulation Day</span>
                  <span className="font-semibold text-accent-foreground">
                    {ovulationDate ? ovulationDate.toLocaleDateString() : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tracker;
