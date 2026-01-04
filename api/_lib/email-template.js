/**
 * Build HTML email template for Ketubah text
 */
export function buildEmailHTML(englishText, hebrewText, couponCode) {
    return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Ketubah Text</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Frank+Ruhl+Libre:wght@500&family=Inter:wght@400;500&display=swap');

        body {
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.6;
            color: #1A202C;
            max-width: 680px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #F9F7F2;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            overflow: hidden;
            border: 1px solid #E2E8F0;
        }
        .header {
            text-align: center;
            padding: 40px 0 30px;
            background: white;
            border-bottom: 3px solid #436852;
        }
        .header h1 {
            color: #1A202C;
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            margin: 0 0 8px 0;
            font-weight: 600;
        }
        .header p {
            color: #4A5568;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
        }
        .content-wrapper {
            padding: 40px;
        }
        .section {
            margin-bottom: 35px;
        }
        .section h2 {
            color: #436852;
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 12px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .text-content {
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.8;
            color: #2D3748;
        }
        .hebrew {
            direction: rtl;
            text-align: right;
            font-family: 'Frank Ruhl Libre', serif;
            font-size: 19px;
        }
        .coupon-box {
            background: #F0F4F2;
            color: #1A202C;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 40px 0;
            border: 1px dashed #436852;
        }
        .coupon-box h3 {
            margin: 0 0 12px 0;
            color: #436852;
            font-family: 'Cormorant Garamond', serif;
            font-size: 26px;
        }
        .coupon-desc {
            margin: 0 auto 20px;
            max-width: 500px;
            font-size: 16px;
            color: #4A5568;
        }
        .coupon-code {
            background: white;
            color: #1A202C;
            font-size: 28px;
            font-weight: 700;
            padding: 14px 30px;
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 1px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            font-family: monospace;
            border: 1px solid #E2E8F0;
        }
        .cta-section {
            text-align: center;
            padding: 40px;
            background: #1A202C;
            color: white;
            border-radius: 0 0 16px 16px; 
            margin: 0 -40px -40px -40px;
        }
        .cta-btn {
            display: inline-block;
            background: #D4AF37;
            color: #1A202C;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 20px;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            color: #718096;
            font-size: 12px;
            margin-top: 30px;
            padding: 0 20px;
        }
        @media only screen and (max-width: 600px) {
            body { padding: 10px; }
            .container { border-radius: 0; }
            .content-wrapper { padding: 20px; }
            .cta-section { margin: 0 -20px -20px -20px; padding: 30px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Ketubah Text</h1>
            <p>Created by Maybie & Co.</p>
        </div>

        <div class="content-wrapper">
            <div class="section">
                <h2>English Version</h2>
                <div class="text-content">${englishText}</div>
            </div>

            <div class="section hebrew">
                <h2>גרסה עברית</h2>
                <div class="text-content">${hebrewText}</div>
            </div>

            ${couponCode ? `
            <div class="coupon-box">
                <h3>Gift: $30 Credit</h3>
                <div class="coupon-desc">
                    <p>This code gives you a <strong>$30 credit</strong> to offset the cost of our "Custom English & Hebrew Translation" service.</p>
                </div>
                <div class="coupon-code">${couponCode}</div>
            </div>
            ` : ''}
        </div>

        <div class="cta-section">
            <h3 style="margin: 0 0 10px 0; font-family: 'Cormorant Garamond', serif; font-size: 24px; color: white;">Ready to Print Your Ketubah?</h3>
            <p style="color: #cbd5e0; margin: 0;">Browse over 500 customizable modern designs.</p>
            <a href="https://maybie.co" class="cta-btn">Shop Modern Ketubahs →</a>
        </div>
    </div>

    <div class="footer">
        <p>May your marriage be filled with love, joy, and blessings.</p>
        <p>© ${new Date().getFullYear()} Maybie & Co.</p>
    </div>
</body>
</html>
`;
}
