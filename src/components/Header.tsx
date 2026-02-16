"use client";

import { Flex, Button, Text } from "@once-ui-system/core";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export const Header = () => {
  const pathname = usePathname();
  const t = useTranslations("Header");

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("services"), href: "/services" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <Flex
      as="header"
      fillWidth
      padding="s"
      horizontal="between"
      vertical="center"
      background="surface"
      style={{
        borderBottom: "1px solid var(--neutral-border-weak)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <Text variant="heading-strong-l" onBackground="brand-strong">
          {t("title")}
        </Text>
      </Link>

      <Flex gap="s" vertical="center">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "secondary" : "tertiary"}
              size="s"
            >
              {item.label}
            </Button>
          </Link>
        ))}
        <LanguageSwitcher />
      </Flex>
    </Flex>
  );
};
