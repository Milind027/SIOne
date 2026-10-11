import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    return '';
  }
}
