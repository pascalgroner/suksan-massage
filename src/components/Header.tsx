"use client";

import { useState } from "react";
import { Flex, Button, Text, Column, IconButton } from "@once-ui-system/core";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export const Header = () => {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4 items-center">
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
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageSwitcher />
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="tertiary"
          size="s"
          prefixIcon={isMenuOpen ? "close" : "menu"} // Assuming 'menu' and 'close' icons exist in once-ui
        />
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <Column
          fillWidth
          background="surface"
          padding="m"
          gap="s"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            borderBottom: "1px solid var(--neutral-border-weak)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 99,
          }}
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref onClick={() => setIsMenuOpen(false)}>
              <Button
                fillWidth
                variant={pathname === item.href ? "secondary" : "tertiary"}
                size="m"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Column>
      )}
    </Flex>
  );
};
