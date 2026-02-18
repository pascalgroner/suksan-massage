"use client";

import { QRCodeSVG } from 'qrcode.react';
import { Column, Text, Flex, Heading, Button } from '@once-ui-system/core';
import { useRef } from 'react';
export default function ReviewCardPage() {

  // Print Logic
  const handlePrint = () => {
    window.print();
  };

  const reviewUrl = "https://www.google.com/search?q=thai+massage+bern&sca_esv=784db34c22f0db79&hl=en&authuser=0&udm=1&sxsrf=ANbL-n5T_eCROdJMNv-VJeLOftcjA1QmYQ:1771456285780&ei=HUeWabOwL_a7hbIPrrOO-AM&start=20&sa=N&sstk=Af77f_exwalfdMGjTfxlLMm5Bj6pvbJDGSEADElHuvJ3otsvy-bGvhj1HJaqNlInC_YnQXk9rPXiB7pvBikwUUjvG7FsUmDqcbDmVw&ved=2ahUKEwjzspj1lOSSAxX2XUEAHa6ZAz8Q8NMDegQIDxAM&biw=1424&bih=841&dpr=2&lqi=ChF0aGFpIG1hc3NhZ2UgYmVybpIBFnRoYWlfbWFzc2FnZV90aGVyYXBpc3Q#lkt=LocalPoiReviews&rlimm=14808893428615198410&lrd=0x478e39e99539d0a1:0xcd83c21cc939b6ca,3,,,,";

  return (
    <Column fillWidth horizontal="center" padding="64" gap="32">
        <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card, #printable-card * {
            visibility: visible;
          }
          #printable-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 105mm;
            height: 148mm;
            border: none;
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Hide standard headers/footers if possible, though browser dependent */
          @page {
            size: A6;
            margin: 0;
          }
        }
      `}</style>
      
      <Flex direction="column" gap="16" horizontal="center" className="no-print">
        <Heading variant="display-strong-s">Google Review Card (A6)</Heading>
        <Text variant="body-default-m">Click print to generate the A6 card.</Text>
        <Button onClick={handlePrint} variant="primary">Print Card</Button>
      </Flex>

      {/* The Printable Card Area */}
      <div id="printable-card" style={{
        width: '105mm',
        height: '148mm',
        backgroundColor: 'var(--brand-background-strong)', // Using brand color
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid #ccc', // preview border
        borderRadius: '8px',     // preview radius
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Logo / Brand Name */}
        <Flex direction="column" horizontal="center" gap="8">
            <QRCodeSVG 
                value={reviewUrl} 
                size={160} 
                bgColor={"#ffffff"}
                fgColor={"#000000"} 
                level={"M"}
                imageSettings={{
                    src: "/icon.png",
                    x: undefined,
                    y: undefined,
                    height: 34,
                    width: 34,
                    excavate: true,
                }}
            />
        </Flex>

        <Flex direction="column" gap="8">
            <Heading variant="heading-strong-l" style={{ color: 'black' }}>
                Suksan Massage
            </Heading>
            <Text variant="body-default-m" style={{ color: '#333' }}>
                Weingartstrasse 57, 3014 Bern
            </Text>
        </Flex>

        <div style={{ width: '60px', height: '2px', background: 'var(--brand-solid-strong)' }}></div>

        <Flex direction="column" gap="8">
             <Text variant="heading-strong-m" style={{ color: 'var(--brand-solid-strong)' }}>
                Hat es Ihnen gefallen?
            </Text>
            <Text variant="body-default-s" style={{ color: '#555', maxWidth: '200px' }}>
                Wir würden uns sehr über Ihre Bewertung auf Google freuen.
            </Text>
        </Flex>
         
          <Text variant="body-default-xs" style={{ color: '#999', marginTop: 'auto' }}>
            Scannen Sie den QR-Code mit Ihrer Kamera
        </Text>
      </div>

    </Column>
  );
}
