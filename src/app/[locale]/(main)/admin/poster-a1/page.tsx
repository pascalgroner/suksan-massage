"use client";

import { useRef } from 'react';
import { Column, Text, Flex, Heading, Button } from '@once-ui-system/core';
import { QRCodeSVG } from 'qrcode.react';

export default function PosterA1Page() {

  const handlePrint = () => {
    window.print();
  };

  const websiteUrl = "https://www.suksan-massage.com";
  const reviewUrl = "https://www.google.com/search?q=thai+massage+bern&sca_esv=784db34c22f0db79&hl=en&authuser=0&udm=1&sxsrf=ANbL-n5T_eCROdJMNv-VJeLOftcjA1QmYQ:1771456285780&ei=HUeWabOwL_a7hbIPrrOO-AM&start=20&sa=N&sstk=Af77f_exwalfdMGjTfxlLMm5Bj6pvbJDGSEADElHuvJ3otsvy-bGvhj1HJaqNlInC_YnQXk9rPXiB7pvBikwUUjvG7FsUmDqcbDmVw&ved=2ahUKEwjzspj1lOSSAxX2XUEAHa6ZAz8Q8NMDegQIDxAM&biw=1424&bih=841&dpr=2&lqi=ChF0aGFpIG1hc3NhZ2UgYmVybpIBFnRoYWlfbWFzc2FnZV90aGVyYXBpc3Q#lkt=LocalPoiReviews&rlimm=14808893428615198410&lrd=0x478e39e99539d0a1:0xcd83c21cc939b6ca,3,,,,";

  return (
    <>
      {/* Screen Controls – hidden when printing */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the poster */
          body * { visibility: hidden !important; }
          #poster-a1, #poster-a1 * { visibility: visible !important; }
          #poster-a1 {
            position: fixed !important;
            left: 0 !important; top: 0 !important;
            width: 594mm !important;
            height: 841mm !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }
          @page {
            size: A1 portrait;
            margin: 0;
          }
          .no-print { display: none !important; }
        }

        /* ---- Poster Typography (print-optimized) ---- */
        #poster-a1 {
          font-family: 'Playfair Display', 'Georgia', serif;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #poster-a1 .poster-headline {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 72pt;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
          text-shadow: 0 2px 40px rgba(0,0,0,0.5);
        }
        #poster-a1 .poster-subheadline {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 32pt;
          font-weight: 300;
          line-height: 1.4;
          color: #ffffffdd;
          text-shadow: 0 1px 20px rgba(0,0,0,0.4);
        }
        #poster-a1 .poster-brand {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 96pt;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #D4A843;
          text-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        #poster-a1 .poster-tagline {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 26pt;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ffffffcc;
        }
        #poster-a1 .poster-service-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 28pt;
          font-weight: 600;
          color: #D4A843;
        }
        #poster-a1 .poster-service-desc {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 16pt;
          font-weight: 300;
          color: #ffffffbb;
          line-height: 1.5;
        }
        #poster-a1 .poster-price-label {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 22pt;
          font-weight: 400;
          color: #fff;
        }
        #poster-a1 .poster-price-value {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 30pt;
          font-weight: 700;
          color: #D4A843;
        }
        #poster-a1 .poster-contact {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 20pt;
          font-weight: 400;
          color: #fff;
        }
        #poster-a1 .poster-contact-highlight {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 22pt;
          font-weight: 600;
          color: #D4A843;
        }
        #poster-a1 .poster-cta {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 28pt;
          font-weight: 600;
          color: #0f3d0f;
          background: linear-gradient(135deg, #D4A843, #F0D68A);
          padding: 16pt 48pt;
          border-radius: 50pt;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        #poster-a1 .poster-wat-pho {
          font-family: 'Prompt', 'Segoe UI', sans-serif;
          font-size: 18pt;
          font-weight: 300;
          font-style: italic;
          color: #D4A843;
          border: 1px solid #D4A84366;
          padding: 8pt 24pt;
          border-radius: 8pt;
        }
      `}</style>

      <div className="no-print" style={{ padding: '40px', textAlign: 'center', background: '#111', minHeight: '100px' }}>
        <h1 style={{ color: '#fff', marginBottom: '16px', fontFamily: 'sans-serif' }}>A1 Werbeplakat – Suksan Massage</h1>
        <p style={{ color: '#aaa', marginBottom: '24px', fontFamily: 'sans-serif' }}>Vorschau in verkleinerter Darstellung. Klicke &quot;Drucken&quot; für reales A1 Format (594 × 841 mm).</p>
        <button
          onClick={handlePrint}
          style={{
            padding: '12px 40px', fontSize: '18px', fontWeight: 600,
            background: 'linear-gradient(135deg, #D4A843, #F0D68A)', color: '#0f3d0f',
            border: 'none', borderRadius: '30px', cursor: 'pointer'
          }}
        >
          🖨️ Poster drucken (A1)
        </button>
      </div>

      {/* ============================================ */}
      {/*  THE A1 POSTER                               */}
      {/* ============================================ */}
      <div id="poster-a1" style={{
        width: '594mm',
        height: '841mm',
        margin: '40px 0 40px 40px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a1f0a',
        boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
        borderRadius: '4px',
        /* scale down for screen preview */
        transform: 'scale(0.35)',
        transformOrigin: 'top left',
      }}>

        {/* ---- BACKGROUND IMAGE (hero) ---- */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '55%',
          backgroundImage: 'url(/images/poster-hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          zIndex: 0,
        }}>
          {/* gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
            background: 'linear-gradient(to top, #0a1f0a 0%, #0a1f0a88 40%, transparent 100%)',
          }} />
          {/* top vignette */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '30%',
            background: 'linear-gradient(to bottom, #0a1f0a88 0%, transparent 100%)',
          }} />
        </div>

        {/* ---- CONTENT LAYER ---- */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: '60pt 50pt',
          boxSizing: 'border-box',
        }}>

          {/* ── TOP: Brand Name ── */}
          <div style={{ textAlign: 'center', marginBottom: '20pt' }}>
            <div className="poster-brand">Suksan Massage</div>
            <div className="poster-tagline">Authentische Thaimassage im Breitsch</div>
          </div>

          {/* ── HERO TEXT ── */}
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '30pt' }}>
            <div className="poster-headline">
              Entspannen.<br />Erholen.<br />Regenerieren.
            </div>
            <div style={{ marginTop: '20pt' }} className="poster-subheadline">
              Gönnen Sie sich eine Auszeit vom Alltag —<br />
              direkt bei Ihnen im Quartier.
            </div>
          </div>

          {/* ── Wat Pho Badge ── */}
          <div style={{ textAlign: 'center', marginBottom: '40pt' }}>
            <span className="poster-wat-pho">
              ✦ Wat Pho Diplomiert &bull; Über 10 Jahre Erfahrung ✦
            </span>
          </div>

          {/* ── SERVICES GRID ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30pt',
            marginBottom: '40pt',
          }}>
            {/* Service 1 */}
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,168,67,0.25)',
              borderRadius: '16pt',
              padding: '28pt',
            }}>
              <div className="poster-service-title">Traditionelle Thai Massage</div>
              <div className="poster-service-desc" style={{ marginTop: '10pt' }}>
                Akupressur, Dehnungen & Yoga-Positionen — lindert Verspannungen und verbessert die Flexibilität.
              </div>
            </div>
            {/* Service 2 */}
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,168,67,0.25)',
              borderRadius: '16pt',
              padding: '28pt',
            }}>
              <div className="poster-service-title">Öl & Relax Massage</div>
              <div className="poster-service-desc" style={{ marginTop: '10pt' }}>
                Sanfte Massage mit aromatischen Ölen — beruhigt Körper und Geist, fördert die Durchblutung.
              </div>
            </div>
            {/* Service 3 */}
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,168,67,0.25)',
              borderRadius: '16pt',
              padding: '28pt',
            }}>
              <div className="poster-service-title">Rücken- & Nackenmassage</div>
              <div className="poster-service-desc" style={{ marginTop: '10pt' }}>
                Gezielte Behandlung für Rücken und Nacken — löst Verspannungen und lindert Stress.
              </div>
            </div>
            {/* Service 4 */}
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,168,67,0.25)',
              borderRadius: '16pt',
              padding: '28pt',
            }}>
              <div className="poster-service-title">Fussreflex Massage</div>
              <div className="poster-service-desc" style={{ marginTop: '10pt' }}>
                Reflexpunkte an den Füssen stimulieren Organe im Körper — fördert das allgemeine Wohlbefinden.
              </div>
            </div>
          </div>

          {/* ── PRICING BAR ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '50pt',
            padding: '24pt 0',
            borderTop: '1px solid rgba(212,168,67,0.3)',
            borderBottom: '1px solid rgba(212,168,67,0.3)',
            marginBottom: '40pt',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="poster-price-label">30 Min</div>
              <div className="poster-price-value">60 CHF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="poster-price-label">45 Min</div>
              <div className="poster-price-value">80 CHF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="poster-price-label">60 Min</div>
              <div className="poster-price-value">90 CHF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="poster-price-label">90 Min</div>
              <div className="poster-price-value">130 CHF</div>
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{ textAlign: 'center', marginBottom: '40pt' }}>
            <span className="poster-cta">Jetzt Termin vereinbaren</span>
          </div>

          {/* ── BOTTOM: Contact + QR ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'auto',
          }}>
            {/* Contact Info */}
            <div>
              <div className="poster-contact-highlight" style={{ marginBottom: '8pt' }}>
                📍 Weingartstrasse 57 UG, 3014 Bern
              </div>
              <div className="poster-contact">
                📞 +41 76 259 05 33
              </div>
              <div className="poster-contact" style={{ marginTop: '6pt' }}>
                🕐 Mo – Sa: 09:00 – 22:00 Uhr
              </div>
              <div className="poster-contact" style={{ marginTop: '6pt', fontSize: '16pt', color: '#ffffff88' }}>
                ÖV: Bus 20 (Breitfeld) 2 Min. | Tram 3,6,7,8,9 (Breitenrain) 4 Min.
              </div>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#fff', padding: '12pt', borderRadius: '12pt',
                display: 'inline-block',
              }}>
                <QRCodeSVG
                  value={reviewUrl}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#0a1f0a"
                  level="M"
                  imageSettings={{
                    src: "/icon.png",
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>
              <div style={{
                fontFamily: "'Prompt', sans-serif",
                fontSize: '14pt',
                color: '#ffffff99',
                marginTop: '8pt',
              }}>
                Jetzt Bewerten
              </div>
            </div>
          </div>

        </div>

        {/* ── Decorative Bottom Accent Image ── */}
        <div style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: '35%', height: '25%',
          backgroundImage: 'url(/images/poster-spa-items.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
          zIndex: 0,
        }} />

      </div>

      {/* Spacer to account for the scaled poster */}
      <div className="no-print" style={{ height: '300px' }} />
    </>
  );
}
