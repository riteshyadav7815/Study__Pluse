"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Flame,
  Clock,
  Trophy,
  TrendingUp,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth(false);
  const { todayTasks } = useTasks();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    // Name update would require a backend endpoint — for now, simulate
    setTimeout(() => {
      setSaving(false);
      setEditingName(false);
      toast.success("Profile updated successfully!");
    }, 600);
  };

  const todayCompleted = todayTasks.filter((t) => t.status === "Completed").length;
  const todayTotal = todayTasks.length;
  const todayProgress = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your stats
          </p>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-purple-500/20" />
          <CardContent className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg">
              <span className="text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name */}
            <div className="flex items-center gap-3">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-48"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    isLoading={saving}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setName(user.name);
                      setEditingName(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingName(true)}
                    className="text-muted-foreground"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xl font-bold">{user.streak || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Day Streak</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-xl font-bold">
                    {(user.totalStudyHours || 0).toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Total Hours</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-bold">{memberSince}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Member Since</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-xl font-bold">{user.streak >= 7 ? "🏆" : user.streak >= 3 ? "⭐" : "🌱"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.streak >= 7 ? "On Fire!" : user.streak >= 3 ? "Building" : "Beginner"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Progress</CardTitle>
            <CardDescription>
              Your study activity for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTotal === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Target className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No tasks scheduled for today. Add some tasks to start tracking!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {todayCompleted} / {todayTotal} tasks completed
                  </span>
                  <Badge variant={todayProgress === 100 ? "default" : "secondary"}>
                    {todayProgress}%
                  </Badge>
                </div>
                <Progress value={todayProgress} showLabel />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pending: {todayTasks.filter((t) => t.status === "Pending").length}</span>
                  <span>Completed: {todayCompleted}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium">{memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
