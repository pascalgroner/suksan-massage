"use client";

import { Flex, Text, Column, Button } from "@once-ui-system/core";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { social } from "@/resources/once-ui.config";

import buildInfo from "@/build-info.json";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  return (
    <Column
      as="footer"
      fillWidth
      padding="l"
      gap="m"
      background="surface"
      horizontal="center"
      style={{
        borderTop: "1px solid var(--neutral-border-weak)",
        marginTop: "auto",
      }}
    >
      <Flex gap="l" wrap horizontal="center">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {t("home")}
          </Text>
        </Link>
        <Link href="/contact" style={{ textDecoration: "none" }}>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {t("contact")}
          </Text>
        </Link>
        <Link href="/imprint" style={{ textDecoration: "none" }}>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {t("imprint")}
          </Text>
        </Link>
      </Flex>

      <Flex gap="m">
        {social.instagram && (
          <Button
            href={social.instagram}
            prefixIcon="instagram"
            size="s"
            variant="tertiary"
            aria-label="Instagram"
          />
        )}
        {social.facebook && (
          <Button
            href={social.facebook}
            prefixIcon="facebook"
            size="s"
            variant="tertiary"
            aria-label="Facebook"
          />
        )}
      </Flex>

      <Column horizontal="center" gap="xs">
        <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
            {t("copyright", { year: currentYear })}
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak" style={{ opacity: 0.6 }}>
            v{buildInfo.version} ({buildInfo.buildNumber}) - {buildInfo.buildDate}
        </Text>
      </Column>
    </Column>
  );
};
