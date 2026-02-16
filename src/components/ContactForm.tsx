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
    email: "",
    phone: "",
    service: initialService,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("success"));
  };

  return (
    <Column
      as="form"
      onSubmit={handleSubmit}
      fillWidth
      gap="m"
      padding="l"
      background="surface"
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
        />
      </Column>

      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("email")}</Text>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
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
          autoComplete="tel"
        />
      </Column>

      <Column gap="xs">
        <Text as="label" variant="label-default-s" onBackground="neutral-weak">{t("service")}</Text>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
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

      <Button type="submit" variant="primary" fillWidth>
        {t("submit")}
      </Button>
    </Column>
  );
};
