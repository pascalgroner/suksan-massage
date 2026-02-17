"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      alert(t("success"));
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        service: "",
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
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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
          required
          pattern="^(\+41|0041|0)[1-9][0-9]{8}$"
          title="Please enter a valid Swiss phone number (e.g., 079 123 45 67)"
          autoComplete="tel"
          disabled={isSubmitting}
        />
      </Column>

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
            background: "var(--neutral-on-background-weak)",
            border: "1px solid var(--neutral-border-weak)",
            borderRadius: "var(--radius-m)",
            color: "var(--neutral-on-background-strong)",
            fontSize: "var(--font-size-body-default-m)",
          }}
        >
          <option value="">{t("selectService")}</option>
          <option value="thai">{t("thai")}</option>
          <option value="oil">{t("oil")}</option>
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
          rows={4}
          style={{
            padding: "var(--static-space-12)",
            background: "var(--neutral-on-background-weak)",
            border: "1px solid var(--neutral-border-weak)",
            borderRadius: "var(--radius-m)",
            color: "var(--neutral-on-background-strong)",
            fontSize: "var(--font-size-body-default-m)",
            resize: "vertical",
            minHeight: "100px",
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
