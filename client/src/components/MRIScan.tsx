import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, CheckCircle, AlertCircle, Brain, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storage, db, auth } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useRef } from 'react';



const MRIScan = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
        probability: number;
        confidence: number;
        findings: string[];
    } | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const { toast } = useToast();
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    const triggerFileSelect = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
  // 🚀 Simulate analysis and save to Firebase
  const simulateAnalysis = async (selectedFile?: File) => {
    if (!selectedFile || !auth.currentUser) {
      toast({ title: "Upload failed", description: "Please select a valid MRI scan." });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    const uid = auth.currentUser.uid;
    const fileId = uuidv4();
    const fileRef = ref(storage, `scans/${uid}/${fileId}-${selectedFile.name}`);

    try {
      // Upload file to Firebase Storage
      await uploadBytes(fileRef, selectedFile);
      const fileURL = await getDownloadURL(fileRef);

      // Simulate progress bar
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Mock result after 3s
      setTimeout(async () => {
        const mockResult = {
          probability: Math.floor(Math.random() * 40) + 60,
          confidence: Math.floor(Math.random() * 20) + 80,
          findings: [
            'Multiple small follicles detected in ovaries',
            'Ovarian volume appears enlarged',
            'Hormonal pattern suggests PCOS indicators',
            'Recommend follow-up with healthcare provider'
          ]
        };

        setAnalysisResult(mockResult);
        setIsAnalyzing(false);

        // Save result to Firestore
        await addDoc(collection(db, 'users', uid, 'diagnosis'), {
          fileURL,
          ...mockResult,
          createdAt: serverTimestamp()
        });

        toast({
          title: "Analysis Complete!",
          description: "Your MRI scan has been successfully analyzed and saved.",
        });
      }, 3000);
    } catch (err: any) {
      setIsAnalyzing(false);
      toast({
        title: "Upload Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // 🧲 Drag & Drop Support
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      simulateAnalysis(files[0]);
    }
  }, []);

 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    console.log("✅ File selected:", file);
    simulateAnalysis(file); 
  }
};


  return (
    <section id="scan" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI-Powered</span> MRI Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your MRI scan and receive instant PCOS analysis powered by advanced AI technology
          </p>
        </div>

        {/* Upload + Result Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Box */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Upload MRI Scan</span>
              </CardTitle>
              <CardDescription>
                Supports DICOM, JPG, PNG formats. Max size: 50MB
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
                  <p className="text-lg font-medium">Drop your MRI scan here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  <div className="flex justify-center">
  <input
  ref={fileInputRef}
  type="file"
  accept=".dcm,.jpg,.jpeg,.png"
  onChange={handleFileSelect}
  className="hidden"
/>
<Button variant="outline" onClick={triggerFileSelect}>
  <FileImage className="w-4 h-4 mr-2" />
  Select File
</Button>

</div>
</div>

              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="mt-6 space-y-4 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Analyzing scan...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-spin text-primary" />
                    <span>AI processing your MRI data</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-generated insights from your MRI scan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an MRI scan to see your analysis results</p>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="text-center p-6 bg-gradient-secondary rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">PCOS Probability</h3>
                    <div className="text-4xl font-bold text-primary mb-2">{analysisResult.probability}%</div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {analysisResult.confidence}%
                    </div>
                  </div>

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

export default MRIScan;
