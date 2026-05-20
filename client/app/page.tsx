"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  BarChart3,
  CheckSquare,
  Clock,
  Timer,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: CheckSquare,
    title: "Smart Task Tracking",
    description: "Organize study tasks by subject, priority, and status. Never miss a deadline.",
  },
  {
    icon: Clock,
    title: "Weekly Timetable",
    description: "Design your ideal study schedule with a beautiful drag-and-drop weekly planner.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Visualize your progress with detailed charts, trends, and AI-powered insights.",
  },
  {
    icon: Timer,
    title: "Built-in Pomodoro",
    description: "Stay focused with an integrated Pomodoro timer that tracks your sessions.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get personalized recommendations based on your study patterns and performance.",
  },
  {
    icon: Brain,
    title: "Smart Streaks",
    description: "Build consistent study habits with streak tracking and daily motivation.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SP</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Study<span className="text-primary">Pulse</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                AI-powered study tracking for modern students
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Master Your{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Study Game
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Track every study session, optimize your timetable, and unlock your full academic
              potential with data-driven insights and AI-powered recommendations.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Studying Smarter <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base">
                  I already have an account
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {[
                { value: "10K+", label: "Active Students" },
                { value: "1M+", label: "Study Hours Tracked" },
                { value: "95%", label: "Satisfaction Rate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed to help you build better study habits and achieve your goals.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your study routine?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of students who are already studying smarter with StudyPulse.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="text-base">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-[10px] font-bold text-primary-foreground">SP</span>
              </div>
              <span className="text-sm font-medium">StudyPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudyPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}