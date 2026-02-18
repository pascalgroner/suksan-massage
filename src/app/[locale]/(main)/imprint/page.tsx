import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Heading, Text, Column } from "@once-ui-system/core";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Imprint" });

  return {
    title: `${t("title")} | Suksan Massage`,
    description: t("subtitle")
  };
}

export default function Imprint() {
  const t = useTranslations("Imprint");
  const general = useTranslations("General");

  return (
    <Column
      fillWidth
      padding="l"
      gap="l"
      align="center"
    >
      <Column
        maxWidth="m"
        fillWidth
        gap="l"
      >
        <Heading variant="display-strong-s">
          {t("title")}
        </Heading>
        
        <Column gap="s">
            <Text variant="heading-strong-s">{t("subtitle")}</Text>
            <Column gap="xs">
                <Text variant="body-strong-m">Suksan Massage</Text>
                <Text variant="body-default-m">{t("representative")}: {t("representativeName")}</Text>
                <Text variant="body-default-m">{t("addressLine1")}</Text>
                <Text variant="body-default-m">{t("addressLine2")}</Text>
            </Column>
        </Column>

        <Column gap="s">
            <Text variant="heading-strong-s">{t("contact")}</Text>
            <Column gap="xs">
                <Text variant="body-default-m">{t("phone")}: {general("phone")}</Text>
                <Text variant="body-default-m">{t("email")}: info@suksan-massage.com</Text>
            </Column>
        </Column>

        <Column gap="s">
            <Text variant="heading-strong-s">{t("legal")}</Text>
            
            <Column gap="xs">
                <Text variant="body-strong-m">{t("copyright")}</Text>
                <Text variant="body-default-m">{t("copyrightText")}</Text>
            </Column>

            <Column gap="xs" marginTop="s">
                <Text variant="body-strong-m">{t("disclaimer")}</Text>
                <Text variant="body-default-m">{t("disclaimerText")}</Text>
            </Column>
        </Column>
      </Column>
    </Column>
  );
}
