"use client";

import { Heading, Text, Column, Flex, Icon } from "@once-ui-system/core";
import { useTranslations } from "next-intl";

export const Faq = () => {
  const t = useTranslations("Faq");
  const questions = ["q1", "q2", "q3", "q4"];

  return (
    <Column
      fillWidth
      padding="xl"
      gap="l"
      horizontal="center"
      background="surface"
    >
      <Heading variant="display-strong-l" align="center">
        {t("title")}
      </Heading>
      
      <Column fillWidth maxWidth="m" gap="s">
        {questions.map((qKey) => (
          <Column
            key={qKey}
            fillWidth
            padding="m"
            border="neutral-alpha-weak"
            radius="l"
            background="neutral-alpha-weak"
            style={{ overflow: "hidden" }}
          >
            <details className="group" style={{ width: "100%" }}>
              <summary style={{ cursor: "pointer", listStyle: "none", outline: "none" }}>
                <Flex fillWidth horizontal="between" vertical="center" gap="s">
                    <Text variant="heading-strong-s" onBackground="neutral-strong">{t(qKey)}</Text>
                    {/* Icon rotation via group-open if supported by Tailwind, else static */}
                    <Icon name="chevronDown" size="s" onBackground="neutral-medium" />
                </Flex>
              </summary>
              <Column paddingTop="m">
                <Text variant="body-default-m" onBackground="neutral-medium">
                  {t(qKey.replace("q", "a"))}
                </Text>
              </Column>
            </details>
          </Column>
        ))}
      </Column>
    </Column>
  );
};
