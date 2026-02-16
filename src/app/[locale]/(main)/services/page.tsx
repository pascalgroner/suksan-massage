import { Heading, Text, Column, Flex } from "@once-ui-system/core";
import { ServiceCard } from "@/components/ServiceCard";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return {
    title: `${t("title")} - Suksan Massage`,
    description: t("subtitle"),
  };
}

export default async function ServicesPage() {
  const t = await getTranslations("Services");

  const services = [
    {
      title: t("thai.title"),
      description: t("thai.description"),
      imageSrc: "/images/thai-massage.png",
      price: "120 CHF",
      duration: "60 min",
      href: "/contact?service=thai",
    },
    {
      title: t("oil.title"),
      description: t("oil.description"),
      imageSrc: "/images/oil-massage.png",
      price: "130 CHF",
      duration: "60 min",
      href: "/contact?service=oil",
    },
    {
      title: t("foot.title"),
      description: t("foot.description"),
      imageSrc: "/images/foot-massage.png",
      price: "110 CHF",
      duration: "60 min",
      href: "/contact?service=foot",
    },
  ];

  return (
    <Column fillWidth padding="l" gap="xl" horizontal="center">
      <Column maxWidth="m" gap="m" horizontal="center" align="center">
        <Heading variant="display-strong-l">{t("title")}</Heading>
        <Text variant="heading-default-m" onBackground="neutral-weak" align="center">
          {t("subtitle")}
        </Text>
      </Column>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--static-space-32)",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            {...service}
          />
        ))}
      </div>
    </Column>
  );
}
