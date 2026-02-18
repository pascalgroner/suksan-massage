"use client";

import { useState, useEffect } from "react";
import { Button, Column, Flex, Heading, Input, Text, Grid } from "@once-ui-system/core";
import { useTranslations } from "next-intl";
import { EnvVarItem } from "./EnvVarItem";
import { Link } from "@/navigation";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setPassword("LoginTest123");
    }
  }, []);

  // State for raw translation data
  const [translations, setTranslations] = useState<any>({ de: {}, en: {} });
  const [envVars, setEnvVars] = useState<Record<string, string> | null>(null);

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

  const fetchEnv = async (pwd: string) => {
      try {
          const res = await fetch("/api/admin/env", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password: pwd }) 
          });
          if (res.ok) {
              const data = await res.json();
              setEnvVars(data);
          }
      } catch (e) {
          console.error("Failed to fetch env vars");
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
        await fetchEnv(password);
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

  // Helper to delete a FAQ pair
  const deleteFaq = (key: string) => {
    setTranslations((prev: any) => {
        const newState = JSON.parse(JSON.stringify(prev));
        if (newState.de.Faq) {
            delete newState.de.Faq[key];
            delete newState.de.Faq[key.replace('q', 'a')];
        }
        if (newState.en.Faq) {
            delete newState.en.Faq[key];
            delete newState.en.Faq[key.replace('q', 'a')];
        }
        return newState;
    });
  };

  // Helper to add a new FAQ pair
  const addFaq = () => {
    setTranslations((prev: any) => {
        const newState = JSON.parse(JSON.stringify(prev));
        const keys = Object.keys(newState.de.Faq || {}).filter(k => k.startsWith('q'));
        const max = keys.reduce((acc, k) => {
            const num = parseInt(k.replace("q", ""));
            return num > acc ? num : acc;
        }, 0);
        const next = max + 1;
        const qKey = `q${next}`;
        const aKey = `a${next}`;
        
        if (!newState.de.Faq) newState.de.Faq = {};
        if (!newState.en.Faq) newState.en.Faq = {};

        newState.de.Faq[qKey] = "Neue Frage";
        newState.de.Faq[aKey] = "Neue Antwort";
        newState.en.Faq[qKey] = "New Question";
        newState.en.Faq[aKey] = "New Answer";
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

  const getConfigVal = (path: string[]) => {
      if (!translations.config) return "";
      let current = translations.config;
      for (const key of path) {
        if (current === undefined || current === null) return "";
        current = current[key];
      }
      return current || "";
  };

  const updateOpeningHours = (field: 'start' | 'end', value: string) => {
    setTranslations((prev: any) => {
        const newState = JSON.parse(JSON.stringify(prev));
        
        // Update config
        if (!newState.config) newState.config = {};
        if (!newState.config.openingHours) newState.config.openingHours = { start: "09:00", end: "22:00" };
        
        newState.config.openingHours[field] = value;
        
        const start = newState.config.openingHours.start;
        const end = newState.config.openingHours.end;
        const range = `${start} - ${end}`;
        
        // Update translations
        if (!newState.de.OpeningHours) newState.de.OpeningHours = {};
        newState.de.OpeningHours.mondayFriday = range;
        newState.de.OpeningHours.saturday = range;
        
        if (!newState.en.OpeningHours) newState.en.OpeningHours = {};
        newState.en.OpeningHours.mondayFriday = range;
        newState.en.OpeningHours.saturday = range;
        
        return newState;
    });
  };

  const updateServiceDuration = (val: string) => {
      setTranslations((prev: any) => {
        const newState = JSON.parse(JSON.stringify(prev));
        if (!newState.config) newState.config = {};
        if (!newState.config.serviceDuration) newState.config.serviceDuration = { default: 60 };
        newState.config.serviceDuration.default = parseInt(val, 10);
        return newState;
      });
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
        
        {/* Environment Variables */}
        {envVars && (
            <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
                <Heading variant="heading-strong-s">Environment Variables</Heading>
                <Flex gap="m" wrap>
                    {Object.entries(envVars).map(([key, value]) => {
                        return <EnvVarItem key={key} name={key} value={value} />;
                    })}
                </Flex>
            </Column>
        )}

        {/* Global Configuration */}
        <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
            <Heading variant="heading-strong-s">System Configuration</Heading>
            <Flex gap="l" wrap>
                <Column gap="xs" style={{ minWidth: "200px" }}>
                    <Text variant="label-strong-s">Opening Hours</Text>
                    <Flex gap="m">
                        <Input 
                            id="opening-start"
                            label="Start Time"
                            type="time"
                            value={getConfigVal(['openingHours', 'start'])}
                            onChange={(e) => updateOpeningHours('start', e.target.value)}
                        />
                        <Input 
                            id="opening-end"
                            label="End Time"
                            type="time"
                            value={getConfigVal(['openingHours', 'end'])}
                            onChange={(e) => updateOpeningHours('end', e.target.value)}
                        />
                    </Flex>
                    <Text variant="body-default-xs" onBackground="neutral-weak">Updates Mon-Sat times automatically.</Text>
                </Column>
                
                <Column gap="xs" style={{ minWidth: "200px" }}>
                    <Text variant="label-strong-s">Service Defaults</Text>
                    <Input 
                        id="service-duration"
                        label="Default Duration (min)"
                        type="number"
                        value={getConfigVal(['serviceDuration', 'default'])}
                        onChange={(e) => updateServiceDuration(e.target.value)}
                    />
                </Column>
            </Flex>
        </Column>

        {/* Marketing Tools */}
        <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
            <Heading variant="heading-strong-s">Marketing Tools</Heading>
            <Flex gap="m" wrap>
                <Link href="/admin/review-card" passHref>
                    <Button variant="secondary" arrowIcon>Generate Review QR Card (A6)</Button>
                </Link>
                <Link href="/admin/poster-a1" passHref>
                    <Button variant="secondary" arrowIcon>Werbeplakat A1 drucken</Button>
                </Link>
            </Flex>
        </Column>

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
            
            <Text variant="label-strong-s" style={{ marginTop: "8px" }}>Opening Hours (Synced)</Text>
            <Input id="hours-monfri" label="Mon - Fri" value={getVal('de', ['OpeningHours', 'mondayFriday'])} disabled readOnly />
            <Input id="hours-sat" label="Saturday" value={getVal('de', ['OpeningHours', 'saturday'])} disabled readOnly />
            
            <Input id="hours-sun" label="Sunday (Text)" value={getVal('de', ['OpeningHours', 'sunday'])} onChange={(e) => updateTranslation('de', ['OpeningHours', 'sunday'], e.target.value)} style={{ marginTop: "8px" }} />
            </Column>
        </Flex>

        {/* FAQ - Dynamic Editor */}
        <Column fillWidth gap="m" background="surface" padding="l" radius="l" border="neutral-alpha-weak">
            <Heading variant="heading-strong-s">FAQ Editor</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">Manage Frequently Asked Questions.</Text>
            
            {(Object.keys(translations.de.Faq || {})
                .filter(k => k.startsWith('q'))
                .sort((a, b) => parseInt(a.replace("q", "")) - parseInt(b.replace("q", "")))
            ).map((key) => (
                <Column key={key} gap="s" padding="m" border="neutral-alpha-weak" radius="m" background="neutral-alpha-weak">
                    <Flex fillWidth horizontal="between" vertical="center" marginBottom="xs">
                        <Text variant="label-default-s">ID: {key}</Text>
                        <Button variant="tertiary" size="s" onClick={() => deleteFaq(key)}>Delete</Button>
                    </Flex>
                    
                    <Flex gap="m" fillWidth direction="column">
                        <Column fillWidth gap="xs">
                            <Text variant="label-strong-s">German</Text>
                            <Input 
                                id={`faq-${key}-de`} 
                                label="Question" 
                                value={getVal('de', ['Faq', key])} 
                                onChange={(e) => updateTranslation('de', ['Faq', key], e.target.value)} 
                            />
                            <Input 
                                id={`faq-a-${key}-de`} 
                                label="Answer" 
                                value={getVal('de', ['Faq', key.replace('q', 'a')])} 
                                onChange={(e) => updateTranslation('de', ['Faq', key.replace('q', 'a')], e.target.value)} 
                            />
                        </Column>
                        <Column fillWidth gap="xs">
                            <Text variant="label-strong-s">English</Text>
                            <Input 
                                id={`faq-${key}-en`} 
                                label="Question" 
                                value={getVal('en', ['Faq', key])} 
                                onChange={(e) => updateTranslation('en', ['Faq', key], e.target.value)} 
                            />
                            <Input 
                                id={`faq-a-${key}-en`} 
                                label="Answer" 
                                value={getVal('en', ['Faq', key.replace('q', 'a')])} 
                                onChange={(e) => updateTranslation('en', ['Faq', key.replace('q', 'a')], e.target.value)} 
                            />
                        </Column>
                    </Flex>
                </Column>
            ))}

            <Button variant="secondary" onClick={addFaq} size="m">Add New Question</Button>
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
            
            <Button variant="danger" size="l" onClick={async () => {
                if(confirm("Are you sure you want to reset the daily message limit logic?")) {
                    setLoading(true);
                    try {
                        const res = await fetch("/api/admin/reset-counter", { method: "POST" });
                        if (res.ok) alert("Counter reset successfully.");
                        else alert("Failed to reset counter.");
                    } catch (e) {
                        alert("Error resetting counter.");
                    } finally {
                        setLoading(false);
                    }
                }
            }}>Reset Daily Limit</Button>
        </Flex>
      </Flex>
    </Column>
  );
}
