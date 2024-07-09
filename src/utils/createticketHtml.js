const createTicketHTML = (eventName, buyersName,uniqueCode) => 
  `
  <h1>Thank you for purchasing a ticket to ${eventName}</h1>
  <p>Issued to: ${buyersName}</p>
  <p>Unique Code: ${uniqueCode}</p>
  <p>Please use the following QR code in your ticket below for entry</p>
  <p>If you did not initiate this purchase, please contact support immediately.</p>
`;

export default createTicketHTML