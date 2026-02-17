import { Heading, Text, Column, Flex, Button, Icon } from "@once-ui-system/core";
import { ContactForm } from "@/components/ContactForm";
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: `${t("title")} - Suksan Massage`,
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const tGeneral = await getTranslations("General");
  const tHours = await getTranslations("OpeningHours");

  return (
    <Column fillWidth padding="l" gap="xl" horizontal="center">
      <Column maxWidth="l" gap="m" horizontal="center" align="center">
        <Heading variant="display-strong-l">{t("title")}</Heading>
        <Text variant="heading-default-m" onBackground="neutral-weak" align="center">
          {t("subtitle")}
        </Text>
      </Column>

      <Flex
        fillWidth
        gap="l"
        wrap
        horizontal="center"
        style={{ maxWidth: "1200px" }}
      >
        {/* Contact Info & Map */}
        <Column fillWidth gap="l" style={{ flex: 1, minWidth: "300px" }}>
          <Column gap="m" padding="l" background="surface" border="neutral-alpha-weak" radius="l">
            <Heading variant="heading-strong-m">{t("locationHours")}</Heading>
            
            <Column gap="s">
              <Flex gap="s" vertical="center">
                <Icon name="location" onBackground="brand-medium" />
                <Text>{tGeneral("address")}</Text>
              </Flex>
              <a href={`tel:${tGeneral("phone").replace(/\s/g, "")}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Flex gap="s" vertical="center" style={{ cursor: "pointer" }}>
                  <Icon name="phone" onBackground="brand-medium" />
                  <Text>{tGeneral("phone")}</Text>
                </Flex>
              </a>
            </Column>

            <Column gap="xs" marginTop="m">
              <Text variant="label-default-s" onBackground="neutral-weak">{t("openingHours")}</Text>
              <Flex horizontal="between">
                <Text>{t("mondayFriday")}</Text>
                <Text>{tHours("mondayFriday")}</Text>
              </Flex>
              <Flex horizontal="between">
                <Text>{t("saturday")}</Text>
                <Text>{tHours("saturday")}</Text>
              </Flex>
              <Flex horizontal="between">
                <Text>{t("sunday")}</Text>
                <Text>{tHours("sunday")}</Text>
              </Flex>
            </Column>
          </Column>

          {/* Map Placeholder */}
          <div
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "var(--radius-l)",
              overflow: "hidden",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Weingartstrasse+57,3014+Bern&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Column>

        {/* Contact Form */}
        <Column fillWidth style={{ flex: 1, minWidth: "300px" }}>
          <Suspense fallback={<Column padding="l" center><Text>Loading form...</Text></Column>}>
            <ContactForm />
          </Suspense>
        </Column>
      </Flex>
    </Column>
  );
}
