import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css'
import '@/app/globals.css'

import classNames from "classnames";

import { baseURL, meta, fonts, style, dataStyle } from "@/resources/once-ui.config";
import { Meta, Schema,  Column, Flex, Mask, MatrixFx} from "@once-ui-system/core";
import { Providers } from '@/components/Providers';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return Meta.generate({
    title: meta.home.title,
    description: meta.home.description,
    baseURL: baseURL,
    path: meta.home.path,
    canonical: meta.home.canonical,
    image: meta.home.image,
    robots: meta.home.robots,
    alternates: [
      { href: 'https://suksan-massage.com/de', hrefLang: 'de' },
      { href: 'https://suksan-massage.com/en', hrefLang: 'en' },
    ],
  });
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang={locale}
      fillWidth
      direction="column"
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={meta.home.title}
        description={meta.home.description}
        path={meta.home.path}
      />
      <head>
        {/* ... existing head content ... */}
      </head>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <Column as="body" background="page" fillWidth margin="0" padding="0" style={{ minHeight: "100vh" }}>
            <JsonLd />
            <Column style={{maxHeight: "100dvh"}} fillWidth aspectRatio="1" horizontal="center" position="absolute" top="0" left="0" zIndex={0}>
              <Mask maxWidth="m" x={50} y={0} radius={50}>
                <MatrixFx
                  size={1.5}
                  spacing={5}
                  fps={24}
                  colors={["brand-solid-strong"]}
                  flicker
                />
              </Mask>
            </Column>
            
            <Header />
            
            <Column as="main" fillWidth zIndex={1} style={{ flex: 1 }}>
              {children}
            </Column>

            <Footer />
          </Column>
        </Providers>
      </NextIntlClientProvider>
    </Flex>
  );
}
