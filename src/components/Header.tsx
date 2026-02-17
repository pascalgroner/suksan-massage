"use client";

import { useState } from "react";
import { Flex, Button, Text, Column, IconButton, MatrixFx } from "@once-ui-system/core";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "./Providers";
import LanguageSwitcher from "./LanguageSwitcher";

export const Header = () => {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <Flex
      as="header"
      fillWidth
      padding="s"
      horizontal="between"
      vertical="center"
      style={{
        borderBottom: "1px solid var(--neutral-border-weak)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        overflow: "hidden", // Ensure animation doesn't spill
        backgroundColor: "var(--surface-color)", // Fallback or base
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, opacity: 0.15 }}>
        <MatrixFx
            size={32} // Large blocks for soft effect
            spacing={0}
            fps={10} // Slow animation
            colors={["brand-medium", "accent-medium"]} 
            flicker={false}
        />
      </div>

      <Link href="/" style={{ textDecoration: "none", zIndex: 1 }}>
        <Text variant="heading-strong-l" onBackground="brand-strong">
          {t("title")}
        </Text>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4 items-center" style={{ zIndex: 1 }}>
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
        <IconButton
          onClick={toggleTheme}
          variant="tertiary"
          size="s"
          icon={theme === "dark" ? "sun" : "moon"}
          tooltip={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        />
        <LanguageSwitcher />
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-2" style={{ zIndex: 1 }}>
        <IconButton
          onClick={toggleTheme}
          variant="tertiary"
          size="s"
          icon={theme === "dark" ? "sun" : "moon"}
        />
        <LanguageSwitcher />
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="tertiary"
          size="s"
          prefixIcon={isMenuOpen ? "close" : "menu"}
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
