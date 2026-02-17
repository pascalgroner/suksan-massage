"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Column, Button, Flex, Text, Input } from "@once-ui-system/core";
import { useTranslations } from "next-intl";

export const ContactForm = () => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const t = useTranslations("Contact.form");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: initialService,
    date: new Date().toISOString().split("T")[0],
    timeRange: "morning",
    specificTime: "",
    duration: "60",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculate default next slot
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const closingHour = 20; 
    const openingHour = 10;
    
    let targetDate = now;
    let targetTimeStr = "";

    // Check if we are past closing time or close to it
    if (currentHour >= closingHour) {
        // Move to tomorrow
        targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        targetTimeStr = `${openingHour.toString().padStart(2, '0')}:00`;
    } else {
        // We are within today (or before opening)
        if (currentHour < openingHour) {
            targetTimeStr = `${openingHour.toString().padStart(2, '0')}:00`;
        } else {
            // Find next slot: now + 15 min buffer, then round up to next 15 min
            const bufferTime = new Date(now.getTime() + 15 * 60000);
            const m = bufferTime.getMinutes();
            const remain = 15 - (m % 15);
            const nextSlot = new Date(bufferTime.getTime() + (remain === 15 ? 0 : remain) * 60000);
            
            // If calculated slot is past closing, move to tomorrow
            if (nextSlot.getHours() >= closingHour) {
                 targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                 targetTimeStr = `${openingHour.toString().padStart(2, '0')}:00`;
            } else {
                 const h = nextSlot.getHours().toString().padStart(2, '0');
                 const inst = nextSlot.getMinutes().toString().padStart(2, '0');
                 targetTimeStr = `${h}:${inst}`;
            }
        }
    }
    
    setFormData(prev => ({ 
        ...prev, 
        date: targetDate.toISOString().split("T")[0],
        specificTime: targetTimeStr 
    }));
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h < 21; h++) {
        for (let m = 0; m < 60; m += 15) {
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }
    return slots;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // SMS Template formatting
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    const smsBody = `Request from: ${formData.name} ${formData.phone} for ${formData.service} at ${formData.date} ${formData.specificTime} (${formData.duration}min)`;
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, smsBody, phone: cleanPhone }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      alert(t("success"));
      
      setFormData({
        name: "",
        phone: "",
        service: "",
        date: new Date().toISOString().split("T")[0],
        timeRange: "morning",
        specificTime: "",
        duration: "60",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      alert("Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      as="form"
      onSubmit={handleSubmit}
      fillWidth
      gap="m"
      padding="l"
      background="neutral-weak"
      border="neutral-alpha-weak"
      radius="l"
    >
      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("name")}</Text>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" disabled={isSubmitting} />
      </Column>

      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("phone")}</Text>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required pattern="^(\+41|0041|0)[1-9][0-9]{8}$" title="e.g., 079 123 45 67" autoComplete="tel" disabled={isSubmitting} />
      </Column>

      <Flex fillWidth background="neutral-alpha-medium" marginTop="s" marginBottom="s" style={{ height: "1px" }} />

      <Text variant="heading-strong-s">{t("requestTitle")}</Text>

      <Flex gap="m" wrap>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("selectDate")}</Text>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required disabled={isSubmitting} style={{ colorScheme: "dark" }} />
        </Column>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("duration")}</Text>
            <select 
                id="duration" 
                name="duration" 
                value={formData.duration} 
                onChange={handleChange} 
                disabled={isSubmitting} 
                style={{ 
                    padding: "var(--static-space-12)", 
                    borderRadius: "var(--radius-m)", 
                    border: "1px solid var(--neutral-alpha-medium)",
                    background: "var(--neutral-surface)",
                    color: "var(--neutral-on-background-strong)",
                    fontFamily: "var(--font-body)",
                    height: "48px",
                    colorScheme: "dark"
                }}>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min (Standard)</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
            </select>
        </Column>
      </Flex>

      <Flex gap="m" wrap>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("selectTimeRange")}</Text>
            <select 
                id="timeRange" 
                name="timeRange" 
                value={formData.timeRange} 
                onChange={handleChange} 
                disabled={isSubmitting} 
                style={{ 
                    padding: "var(--static-space-12)", 
                    borderRadius: "var(--radius-m)", 
                    border: "1px solid var(--neutral-alpha-medium)",
                    background: "var(--neutral-surface)",
                    color: "var(--neutral-on-background-strong)",
                    fontFamily: "var(--font-body)",
                    height: "48px",
                    colorScheme: "dark"
                }}>
                <option value="morning">{t("morning")}</option>
                <option value="afternoon">{t("afternoon")}</option>
                <option value="evening">{t("evening")}</option>
            </select>
        </Column>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("specificTime")}</Text>
            <select 
                id="specificTime" 
                name="specificTime" 
                value={formData.specificTime} 
                onChange={handleChange} 
                disabled={isSubmitting} 
                style={{ 
                    padding: "var(--static-space-12)", 
                    borderRadius: "var(--radius-m)", 
                    border: "1px solid var(--neutral-alpha-medium)",
                    background: "var(--neutral-surface)",
                    color: "var(--neutral-on-background-strong)",
                    fontFamily: "var(--font-body)",
                    height: "48px",
                    colorScheme: "dark"
                }}>
                {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                ))}
            </select>
        </Column>
      </Flex>

      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("service")}</Text>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            padding: "var(--static-space-12)",
            background: "var(--neutral-surface)",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "var(--radius-m)",
            color: "var(--neutral-on-background-strong)",
            fontSize: "var(--font-size-body-default-m)",
            fontFamily: "var(--font-body)",
            height: "48px",
            colorScheme: "dark"
          }}
        >
          <option value="">{t("selectService")}</option>
          <option value="thai">{t("thai")}</option>
          <option value="oil">{t("oil")}</option>
          <option value="back">{t("back")}</option>
          <option value="foot">{t("foot")}</option>
          <option value="other">{t("other")}</option>
        </select>
      </Column>
      
      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("message")}</Text>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={3}
          style={{
            padding: "var(--static-space-12)",
            background: "var(--neutral-surface)",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "var(--radius-m)",
            color: "var(--neutral-on-background-strong)",
            fontSize: "var(--font-size-body-default-m)",
            fontFamily: "var(--font-body)",
            resize: "vertical",
            minHeight: "80px",
          }}
        />
      </Column>

      {submitStatus === 'error' && (
        <Text variant="body-default-s" onBackground="danger-medium">
          Something went wrong. Please try again or contact us directly.
        </Text>
      )}

      <Button 
        type="submit" 
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
