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
                <Text>Musterstrasse 12, 3000 Bern</Text>
              </Flex>
              <Flex gap="s" vertical="center">
                <Icon name="phone" onBackground="brand-medium" />
                <Text>+41 31 123 45 67</Text>
              </Flex>
              <Flex gap="s" vertical="center">
                <Icon name="email" onBackground="brand-medium" />
                <Text>info@suksan-massage.ch</Text>
              </Flex>
            </Column>

            <Column gap="xs" marginTop="m">
              <Text variant="label-default-s" onBackground="neutral-weak">{t("openingHours")}</Text>
              <Flex horizontal="between">
                <Text>{t("mondayFriday")}</Text>
                <Text>10:00 - 20:00</Text>
              </Flex>
              <Flex horizontal="between">
                <Text>{t("saturday")}</Text>
                <Text>10:00 - 18:00</Text>
              </Flex>
              <Flex horizontal="between">
                <Text>{t("sunday")}</Text>
                <Text>{t("closed")}</Text>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.312952474163!2d7.444975!3d46.947974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39d0c64c2ec3%3A0xa0f57c5f85e3b5e7!2sBern!5e0!3m2!1sen!2sch!4v1716300000000!5m2!1sen!2sch"
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
