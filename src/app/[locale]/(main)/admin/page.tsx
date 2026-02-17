"use client";

import { useState } from "react";
import { Button, Column, Flex, Heading, Input, Text } from "@once-ui-system/core";
import { useTranslations } from "next-intl";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State for raw translation data
  const [translations, setTranslations] = useState<any>({ de: {}, en: {} });

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setTranslations(data);
      } else {
        setError("Failed to load content.");
      }
    } catch {
      setError("Failed to connect to server.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        await fetchContent();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(translations),
      });

      if (res.ok) {
        alert("Changes saved successfully!");
      } else {
        alert("Failed to save changes.");
      }
    } catch {
      alert("Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to deep update the translations state
  const updateTranslation = (lang: 'de' | 'en', path: string[], value: any) => {
    setTranslations((prev: any) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newState[lang];
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  // Helper to safely access nested properties
  const getVal = (lang: 'de' | 'en', path: string[]) => {
    let current = translations[lang];
    for (const key of path) {
      if (current === undefined || current === null) return "";
      current = current[key];
    }
    return current || "";
  };

  if (!isAuthenticated) {
    return (
      <Column fillWidth padding="xl" center style={{ minHeight: "80vh" }}>
        <Column gap="l" background="surface" padding="xl" radius="l" border="neutral-alpha-weak" style={{ maxWidth: "400px", width: "100%" }}>
          <Heading variant="display-strong-s" align="center">Admin Login</Heading>
          <form 
            onSubmit={(e) => { handleLogin(e); }} 
            style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-16)" }}
          >
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <Text variant="body-default-s" onBackground="danger-medium">{error}</Text>}
            <Button type="submit" variant="primary" loading={loading} fillWidth>Login</Button>
          </form>
        </Column>
      </Column>
    );
  }

  return (
    <Column fillWidth padding="l" gap="xl" horizontal="center">
      <Heading variant="display-strong-m">Admin Dashboard</Heading>
      
      <Flex gap="xl" wrap style={{ maxWidth: "1000px", width: "100%" }} direction="column">
        
        {/* Banner Settings */}
        <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
          <Heading variant="heading-strong-s">Announcement Banner</Heading>
          <Flex gap="m" vertical="center">
            <input 
              type="checkbox" 
              checked={getVal('de', ['Banner', 'active']) === true} 
              onChange={(e) => {
                const isActive = e.target.checked;
                updateTranslation('de', ['Banner', 'active'], isActive);
                updateTranslation('en', ['Banner', 'active'], isActive);
              }}
              id="banner-active"
              style={{ width: "20px", height: "20px" }}
            />
            <Text as="label" htmlFor="banner-active" variant="body-strong-m">Show Banner on Homepage</Text>
          </Flex>
          <Input 
            id="banner-text-de"
            label="Banner Text (German)" 
            value={getVal('de', ['Banner', 'text'])}
            onChange={(e) => updateTranslation('de', ['Banner', 'text'], e.target.value)}
          />
          <Input 
            id="banner-text-en"
            label="Banner Text (English)" 
            value={getVal('en', ['Banner', 'text'])}
            onChange={(e) => updateTranslation('en', ['Banner', 'text'], e.target.value)}
          />
        </Column>

        <Flex gap="xl" wrap fillWidth>
            {/* Pricing */}
            <Column gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak" style={{ flex: 1, minWidth: "300px" }}>
            <Heading variant="heading-strong-s">Pricing (CHF)</Heading>
            <Input id="price-30" label="30 Min" value={getVal('de', ['Pricing', 'price30'])} onChange={(e) => { updateTranslation('de', ['Pricing', 'price30'], e.target.value); updateTranslation('en', ['Pricing', 'price30'], e.target.value); }} />
            <Input id="price-45" label="45 Min" value={getVal('de', ['Pricing', 'price45'])} onChange={(e) => { updateTranslation('de', ['Pricing', 'price45'], e.target.value); updateTranslation('en', ['Pricing', 'price45'], e.target.value); }} />
            <Input id="price-60" label="60 Min" value={getVal('de', ['Pricing', 'price60'])} onChange={(e) => { updateTranslation('de', ['Pricing', 'price60'], e.target.value); updateTranslation('en', ['Pricing', 'price60'], e.target.value); }} />
            <Input id="price-90" label="90 Min" value={getVal('de', ['Pricing', 'price90'])} onChange={(e) => { updateTranslation('de', ['Pricing', 'price90'], e.target.value); updateTranslation('en', ['Pricing', 'price90'], e.target.value); }} />
            </Column>

            {/* Opening Hours & Contact */}
            <Column gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak" style={{ flex: 1, minWidth: "300px" }}>
            <Heading variant="heading-strong-s">General Info</Heading>
            <Input id="contact-phone" label="Phone Number" value={getVal('de', ['General', 'phone'])} onChange={(e) => { updateTranslation('de', ['General', 'phone'], e.target.value); updateTranslation('en', ['General', 'phone'], e.target.value); }} />
            <Input id="hours-monfri" label="Mon - Fri" value={getVal('de', ['OpeningHours', 'mondayFriday'])} onChange={(e) => { updateTranslation('de', ['OpeningHours', 'mondayFriday'], e.target.value); updateTranslation('en', ['OpeningHours', 'mondayFriday'], e.target.value); }} />
            <Input id="hours-sat" label="Saturday" value={getVal('de', ['OpeningHours', 'saturday'])} onChange={(e) => { updateTranslation('de', ['OpeningHours', 'saturday'], e.target.value); updateTranslation('en', ['OpeningHours', 'saturday'], e.target.value); }} />
            <Input id="hours-sun" label="Sunday (Text)" value={getVal('de', ['OpeningHours', 'sunday'])} onChange={(e) => updateTranslation('de', ['OpeningHours', 'sunday'], e.target.value)} />
            </Column>
        </Flex>

        {/* FAQ - Simplified for MVP */}
        <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
            <Heading variant="heading-strong-s">FAQ Editor</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">Edit the FAQ questions and answers below.</Text>
            
            <Input id="faq-q1-de" label="Question 1 (DE)" value={getVal('de', ['Faq', 'q1'])} onChange={(e) => updateTranslation('de', ['Faq', 'q1'], e.target.value)} />
            <Input id="faq-a1-de" label="Answer 1 (DE)" value={getVal('de', ['Faq', 'a1'])} onChange={(e) => updateTranslation('de', ['Faq', 'a1'], e.target.value)} />
            
            <Input id="faq-q1-en" label="Question 1 (EN)" value={getVal('en', ['Faq', 'q1'])} onChange={(e) => updateTranslation('en', ['Faq', 'q1'], e.target.value)} />
            <Input id="faq-a1-en" label="Answer 1 (EN)" value={getVal('en', ['Faq', 'a1'])} onChange={(e) => updateTranslation('en', ['Faq', 'a1'], e.target.value)} />
        </Column>

        <Flex gap="m">
            <Button variant="primary" onClick={handleSave} loading={loading} size="l">Save All Changes</Button>
            <Button variant="secondary" onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(translations, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "website-content.json");
                document.body.appendChild(downloadAnchorNode); // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }} size="l">Download Backup</Button>
        </Flex>
      </Flex>
    </Column>
  );
}
