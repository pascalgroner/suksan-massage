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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
        <Column 
            fillWidth 
            padding="xl" 
            gap="m" 
            background="neutral-weak" 
            radius="l" 
            border="neutral-alpha-weak"
            align="center"
        >
            <Flex 
                width="64" 
                height="64" 
                radius="full" 
                background="brand-medium" 
                center
                marginBottom="m"
            >
                <Text variant="heading-strong-xl" onBackground="neutral-strong">✓</Text>
            </Flex>
            <Heading variant="heading-strong-l" align="center">{t("success")}</Heading>
            <Text variant="body-default-m" align="center" onBackground="neutral-medium">
                {t("successDetails")}
            </Text>
            
            <Column fillWidth gap="xs" padding="m" background="surface" radius="m" border="neutral-alpha-weak" marginTop="m">
                <Flex gap="s"><Text variant="label-default-s" onBackground="neutral-weak">{t("name")}:</Text> <Text variant="body-strong-s">{formData.name}</Text></Flex>
                <Flex gap="s"><Text variant="label-default-s" onBackground="neutral-weak">{t("phone")}:</Text> <Text variant="body-strong-s">{formData.phone}</Text></Flex>
                <Flex gap="s">
                    <Text variant="label-default-s" onBackground="neutral-weak">{t("service")}:</Text> 
                    <Text variant="body-strong-s">
                        {['thai', 'oil', 'foot', 'back', 'other'].includes(formData.service) ? t(formData.service) : formData.service}
                    </Text>
                </Flex>
                <Flex gap="s"><Text variant="label-default-s" onBackground="neutral-weak">{t("selectDate")}:</Text> <Text variant="body-strong-s">{formData.date}</Text></Flex>
                <Flex gap="s">
                    <Text variant="label-default-s" onBackground="neutral-weak">{t("labelTime")}:</Text> 
                    <Text variant="body-strong-s">
                        {formData.specificTime === 'anytime' && ['morning', 'lunch', 'afternoon', 'evening', 'exactTime'].includes(formData.timeRange) 
                            ? t(formData.timeRange) 
                            : formData.specificTime}
                    </Text>
                </Flex>
                <Flex gap="s"><Text variant="label-default-s" onBackground="neutral-weak">{t("duration")}:</Text> <Text variant="body-strong-s">{formData.duration} min</Text></Flex>
                {formData.message && (
                    <Flex gap="s"><Text variant="label-default-s" onBackground="neutral-weak">{t("message")}:</Text> <Text variant="body-strong-s">{formData.message}</Text></Flex>
                )}
            </Column>

            <Button 
                variant="secondary" 
                style={{ marginTop: "var(--static-space-32)" }}
                onClick={() => {
                    setSubmitStatus('idle');
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
                }}
            >
                {t("sendAnother")}
            </Button>
        </Column>
    );
  }

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
        <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            error={!!errors.name}
            errorMessage={errors.name}
            autoComplete="name" 
            disabled={isSubmitting} 
        />
      </Column>

      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("phone")}</Text>
        <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
            error={!!errors.phone}
            errorMessage={errors.phone}
            title={t("phone_example")}
            autoComplete="tel" 
            disabled={isSubmitting} 
        />
        <Text variant="body-default-xs" onBackground="neutral-weak" style={{ marginTop: "-var(--static-space-4)" }}>
            {t("phone_example")}
        </Text>
      </Column>

      <Flex fillWidth background="neutral-alpha-medium" marginTop="s" marginBottom="s" style={{ height: "1px" }} />

      <Text variant="heading-strong-s">{t("requestTitle")}</Text>

      <Flex gap="m" wrap>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("selectDate")}</Text>
            <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                disabled={isSubmitting} 
                style={{ colorScheme: "dark" }} 
            />
        </Column>
        <Column gap="xs" style={{ flex: 1 }}>
            <Text as="label" variant="label-default-s">{t("duration")}</Text>
            <select 
                id="duration" 
                name="duration" 
                value={formData.duration} 
                onChange={handleChange} 
                disabled={isSubmitting} 
                className="form-control"
            >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
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
                className="form-control"
            >
                <option value="">{t("rangeDefault")}</option>
                <option value="exactTime">{t("exactTime")}</option>
                <option value="morning">{t("morning")}</option>
                <option value="lunch">{t("lunch")}</option>
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
                className="form-control"
            >
                <option value="anytime">{t("anytime")}</option>
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
          className={`form-control ${errors.service ? 'error' : ''}`}
        >
          <option value="">{t("selectService")}</option>
          <option value="thai">{t("thai")}</option>
          <option value="oil">{t("oil")}</option>
          <option value="back">{t("back")}</option>
          <option value="foot">{t("foot")}</option>
          <option value="other">{t("other")}</option>
        </select>
        {errors.service && (
            <Text variant="body-default-xs" onBackground="danger-medium">{errors.service}</Text>
        )}
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
          className="form-control"
        />
      </Column>

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
