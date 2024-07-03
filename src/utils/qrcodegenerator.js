import qrcode from 'qrcode';



const generateQRCode = async (buyer,message) => {

    const data = `Welcome, ${buyer}! Your ticket is valid. We hope you have a great time! here at ${message}`

    try {
      return await qrcode.toBuffer(data, 
        { 
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 250,
            margin: 2
         });
    } catch (error) {
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  };

export default generateQRCode;