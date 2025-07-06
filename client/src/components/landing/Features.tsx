import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {  Brain, Heart, Sparkles } from 'lucide-react';
const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 py-20 mx-auto max-w-6xl px-4 lg:px-16">
            <Card className="shadow-soft border-border/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your Ultrasound results and health patterns
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Personalized Care</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored recommendations based on your data
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Always available to answer your health questions
                </p>
              </CardContent>
            </Card>
          </div>
  )
}

export default Features
