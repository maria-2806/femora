
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebaseConfig"
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Calendar,
    MessageCircle,
    Brain,
    Heart,
    CheckCircle,
    ArrowRight,
    User,
    Settings,
    Bell,
    TrendingUp,
    Clock,
    Shield,
    Sparkles,
    BookOpen,
    Target,
    Award,
    Activity,
} from "lucide-react"

export default function DashboardHome() {
    const [isVisible, setIsVisible] = useState(false)
    const [displayName, setDisplayName] = useState("User")

    useEffect(() => {
        setIsVisible(true)

        // 🔐 Fetch displayName from Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) {
                setDisplayName(user.displayName)
            }
        })

        return () => unsubscribe()
    }, [])

    const steps = [

        {
            title: "Upload Your First MRI Scan",
            description: "Get instant AI-powered PCOS analysis",
            icon: Brain,
            status: "current",
            action: "Upload Scan",
            link: "/scan",
        },
        {
            title: "Start Period Tracking",
            description: "Begin monitoring your menstrual cycle",
            icon: Calendar,
            status: "pending",
            action: "Start Tracking",
            link: "/tracker",
        },
        {
            title: "Chat with AI Assistant",
            description: "Get personalized health insights and recommendations",
            icon: MessageCircle,
            status: "pending",
            action: "Start Chat",
            link: "/chat",
        },
    ];

    const features = [
        {
            title: "MRI Analysis",
            description: "AI-powered PCOS detection from your medical scans",
            icon: Brain,
            color: "bg-gradient-primary",
            stats: "95% accuracy",
            action: "Upload Scan",
            link: "/scan",
        },
        {
            title: "Period Tracking",
            description: "Smart cycle monitoring with intelligent predictions",
            icon: Calendar,
            color: "bg-gradient-primary",
            stats: "Predict 3 months ahead",
            action: "Track Cycle",
            link: "/tracker",
        },
        {
            title: "AI Assistant",
            description: "24/7 personalized health companion and advisor",
            icon: MessageCircle,
            color: "bg-gradient-primary",
            stats: "Instant responses",
            action: "Start Chat",
            link: "/chat",
        },
    ];


    const recentActivity = [
        { type: "profile", message: "Profile completed successfully", icon: User },
        { type: "welcome", message: "Welcome to Femora! Let's get started", time: "Today", icon: Heart },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br pt-12 from-pink-50 via-white to-rose-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div
                    className={`mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Welcome back,{" "}
                                <span className="bg-gradient-primary bg-clip-text text-transparent">
                                    {displayName}
                                </span>
                                ! 👋
                            </h1>
                            <p className="text-xl text-gray-600">
                                Let's continue your health journey with personalized AI insights.
                            </p>
                        </div>

                    </div>


                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Getting Started Steps */}
                    <div className="lg:col-span-2">
                        <Card className="border-pink-100 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Getting Started</CardTitle>
                                        <CardDescription>Complete these steps to unlock the full potential of Femora</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 rounded-lg hover:bg-pink-50/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === "completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : step.status === "current"
                                                        ? "bg-gradient-primary text-white"
                                                        : "bg-gray-100 text-gray-400"
                                                    }`}


                                            >
                                                {step.status === "completed" ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <step.icon className="w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                                </div>
                                                <Link to={step.link}>
                                                    <Button
                                                        size="sm"
                                                        variant={step.status === "current" ? "default" : "outline"}
                                                        className={
                                                            step.status === "current"
                                                                ? "bg-gradient-primary hover:from-pink-600 hover:to-rose-600"
                                                                : step.status === "completed"
                                                                    ? "border-green-200 text-green-700 hover:bg-green-50"
                                                                    : ""
                                                        }
                                                        disabled={step.status === "completed"}
                                                    >
                                                        {step.action}
                                                        {step.status !== "completed" && <ArrowRight className="w-3 h-3 ml-1" />}
                                                    </Button>
                                                </Link>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* About Femora */}
                        <Card className="border-pink-100 shadow-lg mt-8">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">About Femora</CardTitle>
                                        <CardDescription>Your AI-powered women's health companion</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="prose prose-pink max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        Femora is revolutionizing women's healthcare through cutting-edge artificial intelligence. Our
                                        platform combines advanced machine learning algorithms with medical expertise to provide you with
                                        personalized, accurate, and actionable health insights.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800 flex items-center">
                                                <Shield className="w-4 h-4 mr-2 text-pink-600" />
                                                Our Mission
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                To empower women with AI-driven health insights, making complex medical data accessible and
                                                actionable for better health outcomes.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800 flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-rose-600" />
                                                Our Promise
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                Privacy-first approach with medical-grade security, evidence-based insights, and 24/7 AI support
                                                tailored to your unique health journey.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="border-pink-100 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {features.map((feature, index) => (

                                    <Link to={feature.link} key={index}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start h-auto p-4 border-pink-100 hover:bg-pink-50 group bg-transparent"
                                        >
                                            <div className="flex items-center w-full">
                                                <div
                                                    className={`w-8 h-8 rounded-lg ${feature.color} flex items-center justify-center mr-3`}
                                                >
                                                    <feature.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="text-left flex-1">
                                                    <div className="font-medium text-gray-800">{feature.title}</div>
                                                    <div className="text-xs text-gray-500">{feature.stats}</div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Button>
                                    </Link>

                                ))}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="border-pink-100 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-rose-600" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <activity.icon className="w-4 h-4 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{activity.message}</p>
                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                {activity.time ? <Clock className="w-3 h-3 mr-1" /> : null}
                                                {activity.time ? activity.time : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Health Tips */}
                        <Card className="border-pink-100 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
                                    Today's Health Tip
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                        💡 <strong>Did you know?</strong> Regular cycle tracking can help identify patterns and potential
                                        health issues early. Start logging your symptoms today for better insights.
                                    </p>

                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>


    )
}
