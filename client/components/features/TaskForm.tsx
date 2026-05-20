"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { getToday, hoursBetween } from "@/lib/utils";
import type { TaskFormData } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export function TaskForm({ open, onClose, onSubmit }: Props) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(getToday());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState<string>("Medium");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!topic.trim()) newErrors.topic = "Topic is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";

    // Validate date is not in the past
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date + "T00:00:00");
      if (selectedDate < today) {
        newErrors.date = "Cannot select a past date";
      }
    }

    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const plannedHours = startTime && endTime ? hoursBetween(startTime, endTime) : 0;
      await onSubmit({
        subject: subject.trim(),
        topic: topic.trim(),
        date,
        startTime,
        endTime,
        priority: priority as "High" | "Medium" | "Low",
        notes: notes.trim(),
        plannedHours,
      });
      // Reset form on success
      setSubject("");
      setTopic("");
      setDate(getToday());
      setStartTime("");
      setEndTime("");
      setPriority("Medium");
      setNotes("");
      setErrors({});
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add Study Task"
      description="Schedule a new study session"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Subject"
            placeholder="e.g., Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            error={errors.subject}
          />
          <Input
            label="Topic"
            placeholder="e.g., Calculus"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            error={errors.topic}
          />
        </div>

        <Input
          type="date"
          label="Date"
          value={date}
          min={getToday()}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={errors.startTime}
          />
          <Input
            type="time"
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={errors.endTime}
          />
        </div>

        <Select
          label="Priority"
          value={priority}
          onValueChange={setPriority}
          options={[
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ]}
        />

        <Textarea
          label="Notes (optional)"
          placeholder="Add any additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
