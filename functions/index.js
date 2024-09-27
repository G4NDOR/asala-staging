/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require('cors')({ origin: true });
const { client } = require('./server/square');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();
const database = admin.database();

// Create and configure a CORS middleware function
// const corsHandler = cors({
  // origin: (origin, callback) => {
    // const allowedOrigins = ['http://127.0.0.1:5000','http://localhost:3000', 'http://172.56.153.2:3000', 'https://asala-staging--staging-ybig25of.web.app/'];
    // if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // callback(null, true);
    // } else {
      // callback(new Error('Not allowed by CORS'));
    // }
  // },
  // methods: ['GET', 'POST'], // Allow specific methods if needed
  // allowedHeaders: ['Content-Type'], // Allow headers required by your requests
  // optionsSuccessStatus: 204 // Use 204 status code for preflight requests
// });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const crypto = require('crypto');
const DOMAIN = {
  PRODUCTION: 'https://asala-staging.web.app/',
  DEVELOPEMENT:'http://127.0.0.1:5000/',
  LOCAL: 'http://localhost:3000/',
}

function verifySquareSignature(req, signatureKey) {
  const body = JSON.stringify(req.body);
  const signature = req.headers['x-square-signature'];

  // Compute HMAC-SHA1 using your Square Webhook signature key
  const hash = crypto
    .createHmac('sha1', signatureKey)
    .update(body)
    .digest('base64');

  // Compare the computed hash with the received signature
  return hash === signature;
}

function validateData(data) {
    if (!data || typeof data !== 'object' || !data.hasOwnProperty('idempotencyKey')) {
        throw new Error('Invalid data structure');
    }
  }



  
  const testFunction = (req, res) => {
    cors(req, res, () => {
      // Your function logic here
      console.log('request.body: ', req.body);
      const data = { test: 'testing' };
      res.status(200).json(data);
    });
  }
  

const getPaymentLink = async (request, response) => {
  console.log("getting payment link")
    // Handle OPTIONS request (preflight)
  //if (request.method === 'OPTIONS') {
  //  response.set('Access-Control-Allow-Origin', request.headers.origin || 'http://localhost:3000');
  //  response.set('Access-Control-Allow-Methods', 'GET, POST');
  //  response.set('Access-Control-Allow-Headers', 'Content-Type');
  //  response.status(204).send(); // Send a success status for the preflight check
  //  return;
  //}    
  // Use CORS middleware
  //corsHandler(request, response, async () => {
    cors(request, response, async ()=>{
      console.log("received body: ", request.body);
      const payload = request.body;
      // const uniquePaymentLinkId = 10000;
      validateData(payload); // Validate the structure of the parsed data

      const data = {
        idempotencyKey: payload.idempotencyKey, // get from client
        description: payload.description, // get from client
        order: {
          locationId: payload.locationId, // get from client
          lineItems: payload.lineItems,
          discounts: payload.discounts,
        },
        checkoutOptions: {
          allowTipping: true,
          //http://127.0.0.1:5000
          redirectUrl: `${DOMAIN.PRODUCTION}confirmation?orderId=${payload.orderId}`, // get from server
          merchantSupportEmail: 'asala.tradition.official@gmail.com', // get from server
          askForShippingAddress: false,
          acceptedPaymentMethods: {
            applePay: true,
            googlePay: true,
            cashAppPay: true,
            afterpayClearpay: true,
          },
          enableCoupon: false, // get from client
          enableLoyalty: false,
        },
        paymentNote: payload.orderId // so that it can be accessed in payment.updated event
      };
        try {
        
  
          console.log("waiting for square response");
          const squareResponse = await client.checkoutApi.createPaymentLink(data);
          console.log("square finished");
    
          const sentPayload = {
            url: squareResponse.result.paymentLink.url,
            statusCode: squareResponse.statusCode,
          };
          console.log('squareResponse result: ', squareResponse.result)
          console.log("sentPayload: ", sentPayload);
          response.status(200).send(sentPayload);
          
        } catch (error) {
            console.error('Error:', error);
            response.status(500).send('Error creating payment');
        }
      })
    
      logger.info("Hello logs!", { structuredData: true });
    
};

// Square webhook handler function
const squareWebhook = async (req, res) => {
  const signatureKey = 'your-square-webhook-signature-key';  // Get this from Square Dashboard

  // Verify Square webhook signature
  // if (!verifySquareSignature(req, signatureKey)) {
    // return res.status(400).send('Invalid signature');
  // }
  // Handle the event type
  try {
    // Verify Square webhook signature (optional but recommended)
    // You can verify the signature using req.headers['x-square-signature'] and a signatureKey from Square

    const event = req.body;
    console.log('Received Square webhook event:', event);
    // Handle the event type you're interested in
    if (event.type === 'payment.updated') {
      const paymentId = event.data.object.payment.id;
      const paymentStatus = event.data.object.payment.status;
      console.log('Payment ID:', paymentId, 'Status:', paymentStatus);
      console.log('Payment :', event.data.object.payment);

      if (paymentStatus === 'COMPLETED') {
        // Payment is successful, update your database or notify the user
        console.log('Payment was successful');
        // Add logic to update your Firestore or Realtime Database, if necessary
        const refPath = 'orders/orderId'; 
        // New data to update
        const updateData = {
          status: 'placed',
        };
        // Update the node in the Firebase Realtime Database
        // await admin.database().ref(refPath).update(updateData);
      } else if (paymentStatus === 'FAILED') {
        // Handle failed payment
        console.log('Payment failed');
      }
    }

    // Send a success response back to Square
    res.status(200).send('Webhook received and processed');
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

// Square webhook sandbox handler function
const squareWebhookSandbox = async (req, res) => {
  const signatureKey = 'your-square-webhook-signature-key';  // Get this from Square Dashboard

  // Verify Square webhook signature
  // if (!verifySquareSignature(req, signatureKey)) {
    // return res.status(400).send('Invalid signature');
  // }
  // Handle the event type
  try {
    // Verify Square webhook signature (optional but recommended)
    // You can verify the signature using req.headers['x-square-signature'] and a signatureKey from Square

    const event = req.body;
    console.log('Received Square webhook event:', event);
    // Handle the event type you're interested in
    if (event.type === 'payment.updated') {
      const paymentId = event.data.object.payment.id;
      const paymentStatus = event.data.object.payment.status;
      const orderId = event.data.object.payment.note;
      console.log('Payment ID:', paymentId, 'Status:', paymentStatus);
      console.log('Payment :', event.data.object.payment);
      console.log('event.data: ', event.data);

      if (paymentStatus === 'COMPLETED') {
        // Payment is successful, update your database or notify the user
        console.log('Payment was successful');
        // Add logic to update your Firestore or Realtime Database, if necessary
        const refPath = `orders/${orderId}`; 
        // New data to update
        const updateData = {
          status: 'placed',
        };
        // Update the node in the Firebase Realtime Database
        console.log('updateData: ', updateData);
        console.log('refPath: ', refPath);
        await admin.database().ref(refPath).update(updateData);
      } else if (paymentStatus === 'FAILED') {
        // Handle failed payment
        console.log('Payment failed');
      }
    }

    // Send a success response back to Square
    res.status(200).send('Webhook received and processed');
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

exports.getPaymentLink = onRequest(getPaymentLink);
exports.squareWebhook = onRequest(squareWebhook);
exports.squareWebhookSandbox = onRequest(squareWebhookSandbox);
exports.testFunction = onRequest(testFunction);
