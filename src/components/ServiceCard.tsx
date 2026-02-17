"use client";

import { Heading, Text, Button, Column, Flex, Badge, Icon } from "@once-ui-system/core";
import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  duration: string;
  href: string;
}

export const ServiceCard = ({
  title,
  description,
  imageSrc,
  duration,
  href,
}: ServiceCardProps) => {
  return (
    <Column
      fillWidth
      background="surface"
      border="neutral-alpha-weak"
      radius="l"
      overflow="hidden"
      style={{
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        height: "100%", // Ensure the card takes full height of the grid cell
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      
      <Column padding="l" gap="m" fillWidth style={{ flex: 1 }}> {/* flex: 1 ensures this column takes remaining space */}
        <Column gap="xs">
          <Heading variant="display-default-s">{title}</Heading>
          
          <Flex gap="s">
            <Badge
              textVariant="label-default-s"
              background="neutral-alpha-weak"
              padding="xs"
              gap="xs"
              vertical="center"
            >
              <Icon name="time" size="s" onBackground="neutral-weak" />
              {duration}
            </Badge>
          </Flex>
        </Column>
        
        <Text variant="body-default-m" onBackground="neutral-weak" style={{ flex: 1 }}> {/* flex: 1 pushes button down */}
          {description}
        </Text>

        <Link href={href} passHref style={{ width: "100%", marginTop: "auto" }}> {/* marginTop: auto acts as a spacer if flex is used */}
          <Button variant="secondary" fillWidth arrowIcon>
            Book Now
          </Button>
        </Link>
      </Column>
    </Column>
  );
};
