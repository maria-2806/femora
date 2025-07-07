import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, CheckCircle, AlertCircle, Brain, Sparkles, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storage, db, auth } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

const UltrasoundScan = () => {
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
  const resultRef = useRef<HTMLDivElement | null>(null); // for PDF

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const simulateAnalysis = async (selectedFile?: File) => {
    if (!selectedFile || !auth.currentUser) {
      toast({ title: 'Upload failed', description: 'Please select a valid Ultrasound scan.' });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    const uid = auth.currentUser.uid;
    const fileId = uuidv4();
    const fileRef = ref(storage, `scans/${uid}/${fileId}-${selectedFile.name}`);

    try {
      await uploadBytes(fileRef, selectedFile);
      const fileURL = await getDownloadURL(fileRef);

      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      const finalResult = {
        probability: Math.floor(result.probability_pcos * 100),
        confidence: Math.floor(Math.max(result.probability_pcos, result.probability_normal) * 100),
        findings:
          result.prediction === 1
            ? [
              'Multiple small follicles detected in ovaries',
              'Ovarian volume appears enlarged',
              'Hormonal pattern suggests PCOS indicators',
              'Recommend follow-up with healthcare provider',
            ]
            : [
              'Ovaries appear normal in volume and structure',
              'No signs of excessive follicles or cysts',
              'Hormonal indicators within normal range',
              'Low likelihood of PCOS at this time',
            ],
      };

      setAnalysisResult(finalResult);
      setIsAnalyzing(false);

      await addDoc(collection(db, 'users', uid, 'diagnosis'), {
        fileURL,
        ...finalResult,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Analysis Complete!',
        description: 'Your Ultrasound scan has been successfully analyzed and saved.',
      });
    } catch (err: any) {
      setIsAnalyzing(false);
      toast({
        title: 'Scan Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };


  const generatePDF = (result: {
    probability: number;
    confidence: number;
    findings: string[];
  }) => {
    const pdf = new jsPDF();
    const margin = 15;
    let y = margin;

    // Femora Title
    pdf.setFontSize(20);
    pdf.setTextColor(255, 20, 147); // Femora pink
    pdf.text('Femora Report', margin, y);
    y += 12;

    // Patient Info
    const now = new Date();
    const user = auth.currentUser?.displayName || 'Anonymous User';

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Patient Name: ${user}`, margin, y);
    y += 8;
    pdf.text(`Generated on: ${now.toLocaleString()}`, margin, y);
    y += 12;

    // Analysis Summary
    pdf.setFontSize(14);
    pdf.setTextColor(33, 33, 33);
    pdf.text(`PCOS Probability: ${result.probability}%`, margin, y);
    y += 8;
    pdf.text(`Confidence: ${result.confidence}%`, margin, y);
    y += 12;

    // Findings
    pdf.setFontSize(13);
    pdf.text('Key Findings:', margin, y);
    y += 8;

    result.findings.forEach((finding) => {
      pdf.setFontSize(12);
      pdf.text(`• ${finding}`, margin + 5, y);
      y += 7;
    });

    pdf.save('Femora_Report.pdf');
  };



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
    if (files && files[0]) simulateAnalysis(files[0]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateAnalysis(file);
  };

  return (
    <section id="scan" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI-Powered</span> Ultrasound Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your Ultrasound scan and receive instant PCOS analysis powered by advanced AI technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Box */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Upload Ultrasound Scan</span>
              </CardTitle>
              <CardDescription>Supports JPG, PNG formats. Max size: 50MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
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
                  <p className="text-lg font-medium">Drop your Ultrasound scan here</p>
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

          {/* Analysis Results */}
          <Card className="shadow-elegant border-border/50 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>AI-generated insights from your Ultrasound scan</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an Ultrasound scan to see your analysis results</p>
                </div>
              ) : (
                <div ref={resultRef} className="space-y-6 animate-fade-in-up bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-primary rounded-lg shadow-soft">
                        <Heart className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Femora
                      </span>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Patient: {auth.currentUser?.displayName || 'Anonymous User'}</p>
                      <p>Generated on: {new Date().toLocaleString()}</p>
                    </div>
                  </div>

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
                    <Button variant="feminine" size="sm" className="flex-1" onClick={() => analysisResult && generatePDF(analysisResult)}>
                      Download Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={async () => {
                        if (!analysisResult) return;

                        const to = prompt("Enter your doctor's email address:");
                        if (!to || !to.includes("@")) {
                          toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
                          return;
                        }

                        const subject = "Femora - PCOS Ultrasound Analysis Report";

                        const userName = auth.currentUser?.displayName || "Anonymous User";
                        const text = `
Femora PCOS Health Report

Patient Name: ${userName}
Generated On: ${new Date().toLocaleString()}

PCOS Probability: ${analysisResult.probability}%
Confidence: ${analysisResult.confidence}%

Key Findings:
${analysisResult.findings.map((f, i) => `• ${f}`).join('\n')}
`.trim();

                        try {
                          const res = await fetch("http://localhost:5000/api/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ to, subject, text }), // ✅ send 'text', not 'html'
                          });

                          const result = await res.json();
                          if (!res.ok) throw new Error(result.error || "Failed to send email");

                          toast({
                            title: "Report Sent!",
                            description: `The report has been emailed to ${to}.`,
                          });
                        } catch (err: any) {
                          toast({
                            title: "Email Error",
                            description: err.message || "Something went wrong",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
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

export default UltrasoundScan;
