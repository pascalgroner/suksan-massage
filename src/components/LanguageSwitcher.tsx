"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useTransition } from "react";
import { Flex, Button } from "@once-ui-system/core";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      router.refresh(); // Refresh to update server components
    });
  };

  return (
    <Flex gap="xs" vertical="center">
      <Button
        variant={locale === "de" ? "primary" : "tertiary"}
        size="s"
        onClick={() => handleLocaleChange("de")}
        disabled={isPending}
      >
        DE
      </Button>
      <Button
        variant={locale === "en" ? "primary" : "tertiary"}
        size="s"
        onClick={() => handleLocaleChange("en")}
        disabled={isPending}
      >
        EN
      </Button>
    </Flex>
  );
}
