"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Column, Button, Flex, Text, Input, Heading } from "@once-ui-system/core";
import { useTranslations, useLocale } from "next-intl";


interface ContactFormProps {
  config: {
    openingHours: {
      start: string;
      end: string;
    };
    serviceDuration: {
      default: number;
    };
  };
}

export const ContactForm = ({ config }: ContactFormProps) => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const t = useTranslations("Contact.form");
  const locale = useLocale();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: initialService,
    date: new Date().toISOString().split("T")[0],
    timeRange: "",
    specificTime: "",
    duration: "60",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Helper to format time
  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const calculateNextSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const openingTimeParts = config.openingHours.start.split(':');
    const closingTimeParts = config.openingHours.end.split(':');
    
    const openingHour = parseInt(openingTimeParts[0], 10);
    const closingHour = parseInt(closingTimeParts[0], 10);
    const defaultDuration = config.serviceDuration.default;

    let targetDate = now;
    let targetTimeStr = "";

    // First check: Are we already past closing time?
    if (currentHour >= closingHour) {
        // Move to tomorrow
        targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        targetTimeStr = config.openingHours.start;
    } else {
        // Calculate earliest possible slot today based on buffer
        const bufferTime = new Date(now.getTime() + 15 * 60000);
        const m = bufferTime.getMinutes();
        const remain = 15 - (m % 15);
        const nextSlot = new Date(bufferTime.getTime() + (remain === 15 ? 0 : remain) * 60000);
        
        // Check if this slot start is before opening time
        if (nextSlot.getHours() < openingHour) {
             nextSlot.setHours(openingHour, 0, 0, 0);
        }

        // Calculate end time of this potential slot
        const potentialEndTime = new Date(nextSlot.getTime() + defaultDuration * 60000);
        
        const closingDate = new Date(nextSlot);
        closingDate.setHours(closingHour, 0, 0, 0);

        if (potentialEndTime > closingDate) {
             // Too late for today, move to tomorrow
             targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
             targetTimeStr = config.openingHours.start;
        } else {
             // Valid slot for today
             targetTimeStr = formatTime(nextSlot);
        }
    }
    return { date: targetDate.toISOString().split("T")[0], time: targetTimeStr };
  };

  // Calculate default next slot on mount
  useEffect(() => {
    const { date, time } = calculateNextSlot();
    setFormData(prev => ({ 
        ...prev, 
        date: date,
        specificTime: time 
    }));
  }, []); // Only runs on mount

  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = parseInt(config.openingHours.start.split(':')[0], 10);
    const endHour = parseInt(config.openingHours.end.split(':')[0], 10);
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 15) {
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }
    return slots;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'timeRange') {
        if (value === 'exactTime') {
            const { time } = calculateNextSlot(); // Reset to calculated next slot
            setFormData(prev => ({ ...prev, [name]: value, specificTime: time }));
        } else if (value !== '') {
            setFormData(prev => ({ ...prev, [name]: value, specificTime: 'anytime' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePoints = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = t("name_required");
    const phoneTrimmed = formData.phone.replace(/\s+/g, '');
    if (!phoneTrimmed) {
        newErrors.phone = t("phone_required");
    } else if (!/^(\+41|0041|0)[1-9][0-9]{8}$/.test(phoneTrimmed)) {
        newErrors.phone = t("phone_invalid");
    }
    if (!formData.service) newErrors.service = t("service_required");
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePoints()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // SMS Template formatting
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    const smsBody = `Request from: ${formData.name} ${formData.phone} for ${formData.service} at ${formData.date} ${formData.specificTime} (${formData.duration}min)`;
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, smsBody, phone: cleanPhone, locale }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      // No alert here, state change triggers UI update
      
      // Form data is NOT cleared here so success view can show it.
      // It is cleared when "Send Another Request" is clicked.
       setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      // Removed alert to rely on UI messaging
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
   // ... (success view code remains same)
  }

  return (
    <Column
      as="form"
      // ... (props)
    >
      {/* ... (fields) */}

      {submitStatus === 'error' && (
        <Column 
            padding="s" 
            background="danger-weak" 
            border="danger-medium" 
            radius="m" 
            marginBottom="s"
        >
            <Text variant="body-default-s" onBackground="danger-strong">
              {t("errorMessage") || "Server error: The message could not be sent. Please try again later or contact us by phone."}
            </Text>
        </Column>
      )}

      <Button 
        type="submit" 
        // ... 
        variant="primary" 
        fillWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : t("submit")}
      </Button>
    </Column>
  );
};
