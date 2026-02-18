"use client";

import { QRCodeSVG } from 'qrcode.react';
import { Column, Text, Flex, Heading, Button } from '@once-ui-system/core';
import { useRef } from 'react';
export default function ReviewCardPage() {

  // Print Logic
  const handlePrint = () => {
    window.print();
  };

  const reviewUrl = "https://search.google.com/local/writereview?placeid=ChIJH8DCIO45jkcRpNPamNi-zJk";

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
