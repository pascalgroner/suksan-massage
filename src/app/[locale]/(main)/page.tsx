"use client";

import {
  Heading,
  Text,
  Button,
  Column,
  Flex,
  Icon,
} from "@once-ui-system/core";
import Image from "next/image";
import { Link } from "@/navigation"; // Use localized Link
import { ServiceCard } from "@/components/ServiceCard";
import { useTranslations, useMessages } from "next-intl";
import { Faq } from "@/components/Faq";

export default function Home() {
  const t = useTranslations("Home");
  const tServices = useTranslations("Services"); // Access services translations for titles
  const tPricing = useTranslations("Pricing");
  
  const messages = useMessages();
  const banner = (messages as any)?.Banner;

  const featuredServices = [
    {
      title: tServices("thai.title"),
      description: tServices("thai.description"),
      imageSrc: "/images/thai-massage.png",
      duration: "30 - 90 min",
      href: "/contact?service=thai",
    },
    {
      title: tServices("oil.title"),
      description: tServices("oil.description"),
      imageSrc: "/images/oil-massage.png",
      duration: "30 - 90 min",
      href: "/contact?service=oil",
    },
    {
      title: tServices("back.title"),
      description: tServices("back.description"),
      imageSrc: "/images/back-massage.png",
      duration: "30 - 60 min",
      href: "/contact?service=back",
    },
    {
      title: tServices("foot.title"),
      description: tServices("foot.description"),
      imageSrc: "/images/foot-massage.png", // Assuming this image exists or follows pattern
      duration: "30 - 60 min",
      href: "/contact?service=foot",
    },
  ];

  return (
    <Column fillWidth>
      {/* Announcement Banner */}
      {banner?.active && (
        <Flex
          fillWidth
          padding="m"
          horizontal="center"
          vertical="center"
          background="neutral-medium"
          border="brand-medium"
          gap="m"
        >
          <Icon name="info" onBackground="brand-strong" />
          <Text variant="body-strong-m" style={{ color: "var(--brand-strong)" }} align="center">
            {banner.text}
          </Text>
        </Flex>
      )}

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

        {/* Pricing Section - Moved Above Services */}
        <Column fillWidth horizontal="center" gap="m" padding="m" background="neutral-weak" radius="l" style={{ maxWidth: "800px", marginBottom: "var(--static-space-32)" }}>
            <Heading variant="heading-strong-m">{tPricing("title")}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">{tPricing("subtitle")}</Text>
            <Flex gap="xl" wrap horizontal="center">
                <Column align="center">
                    <Text variant="heading-strong-s">{tPricing("min30")}</Text>
                    <Text variant="body-default-m">{tPricing("price30")}</Text>
                </Column>
                <Column align="center">
                    <Text variant="heading-strong-s">{tPricing("min45")}</Text>
                    <Text variant="body-default-m">{tPricing("price45")}</Text>
                </Column>
                <Column align="center">
                    <Text variant="heading-strong-s">{tPricing("min60")}</Text>
                    <Text variant="body-default-m">{tPricing("price60")}</Text>
                </Column>
                <Column align="center">
                    <Text variant="heading-strong-s">{tPricing("min90")}</Text>
                    <Text variant="body-default-m">{tPricing("price90")}</Text>
                </Column>
            </Flex>
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
