"use client";

import {
  Heading,
  Text,
  Button,
  Column,
  Flex,
} from "@once-ui-system/core";
import Image from "next/image";
import { Link } from "@/navigation"; // Use localized Link
import { ServiceCard } from "@/components/ServiceCard";
import { useTranslations } from "next-intl";
import { Faq } from "@/components/Faq";

export default function Home() {
  const t = useTranslations("Home");
  const tServices = useTranslations("Services"); // Access services translations for titles

  const featuredServices = [
    {
      title: tServices("thai.title"),
      description: tServices("thai.description"),
      imageSrc: "/images/thai-massage.png",
      price: "120 CHF",
      duration: "60 min",
      href: "/contact?service=thai",
    },
    {
      title: tServices("oil.title"),
      description: tServices("oil.description"),
      imageSrc: "/images/oil-massage.png",
      price: "130 CHF",
      duration: "60 min",
      href: "/contact?service=oil",
    },
  ];

  return (
    <Column fillWidth>
      {/* Hero Section */}
      <Column
        fillWidth
        center
        padding="l"
        style={{ minHeight: "90vh", position: "relative" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
          <Image
            src="/images/hero-bg.png"
            alt="Peaceful Thai Massage Spa"
            fill
            style={{ objectFit: "cover", filter: "brightness(0.6)" }}
            priority
          />
        </div>

        <Column
          fillWidth
          horizontal="center"
          vertical="center"
          gap="l"
          style={{ maxWidth: "800px", textAlign: "center" }}
        >
          <Heading variant="display-strong-xl" style={{ color: "white" }}>
            {t("heroTitle")}
          </Heading>
          <Text
            variant="heading-default-xl"
            style={{ color: "var(--neutral-on-background-medium)" }}
            wrap="balance"
          >
            {t("heroSubtitle")}
          </Text>
          <Link href="/contact" passHref>
            <Button
              id="book-now"
              variant="primary"
              size="l"
              arrowIcon
            >
              {t("bookButton")}
            </Button>
          </Link>
        </Column>
      </Column>

      {/* Featured Services Section */}
      <Column fillWidth padding="xl" gap="l" horizontal="center" background="surface">
        <Column maxWidth="m" gap="m" horizontal="center" align="center">
          <Heading variant="display-strong-l">{t("featuredTitle")}</Heading>
          <Text variant="heading-default-m" onBackground="neutral-weak" align="center">
            {t("featuredSubtitle")}
          </Text>
        </Column>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--static-space-32)",
            width: "100%",
            maxWidth: "1000px",
            marginBottom: "var(--static-space-32)",
          }}
        >
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.title}
              {...service}
            />
          ))}
        </div>

        <Link href="/services" passHref>
          <Button variant="secondary" size="m" arrowIcon>
            {t("viewAllButton")}
          </Button>
        </Link>
      </Column>

      {/* About Section */}
      <Column fillWidth padding="xl" gap="xl" horizontal="center">
        <Flex
          fillWidth
          gap="xl"
          vertical="center"
          horizontal="center"
          wrap
          style={{ maxWidth: "1200px" }}
        >
          {/* About Text */}
          <Column style={{ flex: 1, minWidth: "300px" }} gap="m" align="start">
            <Heading variant="display-strong-l" onBackground="brand-strong">
              {t("aboutTitle")}
            </Heading>
            <Text variant="heading-default-m" onBackground="neutral-weak">
              {t("aboutText1")}
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              {t("aboutText2")}
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium" dangerouslySetInnerHTML={{ __html: t.raw("aboutText3") }} />
            <Text variant="body-default-m" onBackground="neutral-medium" dangerouslySetInnerHTML={{ __html: t.raw("aboutText4") }} />
            <Link href="/contact" passHref>
              <Button variant="primary" arrowIcon>
                {t("meetTeamButton")}
              </Button>
            </Link>
          </Column>

          {/* About Image */}
          <div style={{ flex: 1, minWidth: "300px", position: "relative", aspectRatio: "4/3" }}>
            <Image
              src="/images/team.png"
              alt="Mrs. Kumjuan Vecchi and the Suksan Massage Team"
              fill
              style={{ objectFit: "cover", borderRadius: "var(--radius-l)" }}
            />
          </div>
        </Flex>
      </Column>
      {/* FAQ Section */}
      <Faq />
    </Column>
  );
}
