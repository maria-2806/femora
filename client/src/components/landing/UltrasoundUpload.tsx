import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, CheckCircle, AlertCircle, Brain, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UltrasoundUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    probability: number;
    confidence: number;
    findings: string[];
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // Simulate API analysis
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate analysis completion
    setTimeout(() => {
      setIsAnalyzing(false);
      const mockResult = {
        probability: Math.floor(Math.random() * 40) + 60, // 60-100% for demo
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
        findings: [
          'Multiple small follicles detected in ovaries',
          'Ovarian volume appears enlarged',
          'Hormonal pattern suggests PCOS indicators',
          'Recommend follow-up with healthcare provider'
        ]
      };
      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete!",
        description: "Your Ultrasound scan has been successfully analyzed.",
      });
    }, 3000);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      simulateAnalysis();
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      simulateAnalysis();
    }
  };

  return (
    <section id="scan" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI-Powered</span> Ultrasound Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your Ultrasound scan and receive instant PCOS analysis powered by advanced AI technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Upload Ultrasound Scan</span>
              </CardTitle>
              <CardDescription>
                Supports DICOM, JPG, PNG formats. Maximum file size: 50MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your Ultrasound scan here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                  </div>
                  <input
                    type="file"
                    accept=".dcm,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="Ultrasound-upload"
                  />
                  <label htmlFor="Ultrasound-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <FileImage className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                  </label>
                </div>
              </div>

              {/* Progress */}
              {isAnalyzing && (
                <div className="mt-6 space-y-4 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Analyzing scan...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-spin text-primary" />
                    <span>AI processing your Ultrasound data</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-generated insights from your Ultrasound scan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an Ultrasound scan to see your analysis results</p>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-up">
                  {/* PCOS Probability */}
                  <div className="text-center p-6 bg-gradient-secondary rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">PCOS Probability</h3>
                    <div className="text-4xl font-bold text-primary mb-2">{analysisResult.probability}%</div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {analysisResult.confidence}%
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span>Key Findings</span>
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.findings.map((finding, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button variant="feminine" size="sm" className="flex-1">
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Share with Doctor
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UltrasoundUpload;