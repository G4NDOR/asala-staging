// firestoreUtils.js
import { db } from './firebaseConfig'; // Import your Firebase configuration
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  deleteField
} from 'firebase/firestore';
import { TIMESTAMP } from '../constants/firebase';
import { getIpAddress } from './retreiveIP_Address';
import DEFAULT_VALUES from '../constants/defaultValues';

// Common process to handle errors
const handleError = (error) => {
  console.error("Firebase operation failed: ", error);
  throw new Error(error.message);
};

// Add a new document with auto-generated ID
/**
 * Adds a new document to a specified Firestore collection with auto-generated ID.
 * 
 * @param {string} collectionName - The name of the Firestore collection where the document will be added.
 * @param {Object} data - The data to be added to the document.
 * @returns {Promise<string>} - A promise that resolves to the ID of the newly created document.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * const newDocumentId = await addDocument('users', { name: 'Alice', age: 30 });
 * console.log(newDocumentId); // Output: ID of the newly created document
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    handleError(error);
  }
};

// Set a document with optional merging
/**
 * Sets the document at the specified path with the provided data. Optionally merges with existing data.
 * 
 * @param {string} docPath - The path to the document in Firestore (e.g., 'collectionName/documentId').
 * @param {Object} data - The data to be set in the document.
 * @param {boolean} [merge=false] - If true, merges the data with existing document fields. If false, overwrites the document.
 * @returns {Promise<void>} - A promise that resolves when the document is successfully set.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * await setDocument('users/alice', { age: 31 }, true);
 * // The document 'alice' in the 'users' collection will be updated with new age value, merging with existing data.
 */
export const setDocument = async (docPath, data, merge = false) => {
  try {
    const docRef = doc(db, docPath);
    await setDoc(docRef, data, { merge });
  } catch (error) {
    handleError(error);
  }
};

// Update fields in an existing document
/**
 * Updates specific fields of an existing document.
 * 
 * @param {string} docPath - The path to the document in Firestore (e.g., 'collectionName/documentId').
 * @param {Object} updates - An object containing the fields and their new values to update in the document.
 * @returns {Promise<void>} - A promise that resolves when the document is successfully updated.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * await updateDocument('users/alice', { age: 32 });
 * // The document 'alice' in the 'users' collection will be updated with the new age value.
 */
export const updateDocument = async (docPath, updates) => {
  try {
    const docRef = doc(db, docPath);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleError(error);
  }
};

// Delete a document
/**
 * Deletes the document at the specified path from Firestore.
 * 
 * @param {string} docPath - The path to the document in Firestore (e.g., 'collectionName/documentId').
 * @returns {Promise<void>} - A promise that resolves when the document is successfully deleted.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * await deleteDocument('users/alice');
 * // The document 'alice' will be removed from the 'users' collection.
 */
export const deleteDocument = async (docPath) => {
  try {
    const docRef = doc(db, docPath);
    await deleteDoc(docRef);
  } catch (error) {
    handleError(error);
  }
};

// Get a single document
/**
 * Retrieves the data of a single document from Firestore.
 * 
 * @param {string} docPath - The path to the document in Firestore (e.g., 'collectionName/documentId').
 * @returns {Promise<Object|null>} - A promise that resolves to the document data if it exists, or null if it does not exist.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * const docData = await getDocument('users/alice');
 * console.log(docData); // Output: { name: 'Alice', age: 32 }
 * 
 * // If the document does not exist
 * const docData = await getDocument('users/nonexistent');
 * console.log(docData); // Output: null
 */
export const getDocument = async (docPath) => {
  try {
    const docRef = doc(db, docPath);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    handleError(error);
  }
};

// Get all documents from a collection
/**
 * Retrieves all documents from a specified Firestore collection.
 * 
 * @param {string} collectionName - The name of the Firestore collection from which to retrieve documents.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data, each containing document ID and its data.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * const allUsers = await getCollection('users');
 * console.log(allUsers); // Output: [{ id: 'doc1', name: 'Alice', age: 32 }, { id: 'doc2', name: 'Bob', age: 28 }]
 */
export const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Query documents with a specific condition
/**
 * Queries documents in a collection based on a specified condition.
 * 
 * @param {string} collectionName - The name of the Firestore collection to query.
 * @param {string} field - The field to query on.
 * @param {string} operator - The comparison operator (e.g., '==', '>', '<').
 * @param {*} value - The value to compare the field against.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data that matches the query condition.
 * @throws {Error} - Throws an error if the Firestore operation fails.
 * 
 * @example
 * // Sample usage
 * const youngUsers = await queryCollection('users', 'age', '<', 30);
 * console.log(youngUsers); // Output: [{ id: 'doc2', name: 'Bob', age: 28 }]
 */
export const queryCollection = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Listen to real-time updates for a document
export const listenToDocument = (docPath, callback, errorCallback) => {
  const docRef = doc(db, docPath);
  return onSnapshot(docRef, callback, errorCallback || handleError);
};

// Listen to real-time updates for a collection
export const listenToCollection = (collectionName, callback, errorCallback) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(collectionRef, callback, errorCallback || handleError);
};

// Update a document with server timestamp
export const updateWithTimestamp = async (docPath, field) => {
  try {
    const docRef = doc(db, docPath);
    await updateDoc(docRef, { [field]: serverTimestamp() });
  } catch (error) {
    handleError(error);
  }
};

// Add or remove elements from an array field
export const updateArrayField = async (docPath, field, elements, operation) => {
  try {
    const docRef = doc(db, docPath);
    const update = operation === 'add' ? arrayUnion(...elements) : arrayRemove(...elements);
    await updateDoc(docRef, { [field]: update });
  } catch (error) {
    handleError(error);
  }
};

// Increment a numeric field value
export const incrementField = async (docPath, field, amount) => {
  try {
    const docRef = doc(db, docPath);
    await updateDoc(docRef, { [field]: increment(amount) });
  } catch (error) {
    handleError(error);
  }
};

// Delete a specific field from a document
export const deleteFieldFromDocument = async (docPath, field) => {
  try {
    const docRef = doc(db, docPath);
    await updateDoc(docRef, { [field]: deleteField() });
  } catch (error) {
    handleError(error);
  }
};

// Query and order documents
export const queryAndOrder = async (collectionName, whereField, whereValue, orderByField, limitNum) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(whereField, '==', whereValue),
      orderBy(orderByField),
      limit(limitNum)
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

/*
/   =================================================================
/   Second level abstraction functions:
/   =================================================================
*/


export const loadHomeData = async () => {
  const homePageDynamicOutput = await getDocument("dynamic-output/VpFaBNbAGB6jn99KAo6F");

  //================================================================
  // Dynamic output is loaded and prepared here
  //++++++++++++++++++++++++++++++++++++++++++++++++
  //load welcome section images
  const welcomeImages = homePageDynamicOutput['welcome-section-images'];//array of images
  //sample image object
  //image = {
  //  'title': "Welcome",
  //  'image-src': "url",
  //  'description': "Welcome",
  //}
  const welcomeImagesSrcs = welcomeImages.map(image => {
    return image['image-src'];
  });
  //++++++++++++++++++++++++++++++++++++++++++++++++
  //Load welcome section title
  const welcomeSectionTitle = homePageDynamicOutput['welcome-section-title'];
  //++++++++++++++++++++++++++++++++++++++++++++++++
  //Load welcome section content
  const welcomeSectionContent = homePageDynamicOutput['welcome-section-content'];




  //================================================================
  //Load announcements section content
  const announcements = await getCollection("announcements");
  //Load products section content
  const products = await loadProducts();
  //Load customer id if any
  const ipAddress = await getIpAddress();
  const customers = await queryCollection("customers", "ip-address", "==", ipAddress);
  let customer = DEFAULT_VALUES.CUSTOMER_DETAILS;
  let customerId = DEFAULT_VALUES.CUSTOMER_ID;
  if (customers.length > 0){
    customer = customers[0];
    customerId = customer.id;
  } else {
    customerId = await addDocument("customers", { 'ip-address': `${ipAddress}` });
    customer = { 'ip-address': `${ipAddress}`, 'id': customerId };
  }
  

  const homeData = {
    welcomeImagesSrcs,
    welcomeSectionTitle,
    welcomeSectionContent,
    announcements,
    products,
    customerId,
    customer
    // Add more data as needed
  };
  return homeData;
}

//Load products section content
export const loadProducts = async () => {
  let products = await getCollection("products");
  if (!products)
    products = [];
  return products;
}

export const loadProductPageData = async (productId, producerId) => {
  let producer = await getDocument(`producers/${producerId}`);
  const customerReviews = await queryCollection(`reviews`, "product-id", "==", productId);

  if (!producer) 
    producer = DEFAULT_VALUES.PRODUCER_DETAILS;

  const data = {
    producer,
    customerReviews,
    // Add more data as needed
  };
  return data;
}


/*

Explanation:
    addDocument => Adds a new document with an auto-generated ID to a specified collection.
    setDocument => Sets the document at a specific path, with optional merging of existing data.
    updateDocument => Updates specific fields of an existing document.
    deleteDocument => Deletes a document at a given path.
    getDocument => Retrieves the data from a single document.
    getCollection => Retrieves all documents from a specified collection.
    queryCollection => Queries documents in a collection based on specified conditions.
    listenToDocument => Listens for real-time updates to a document.
    listenToCollection => Listens for real-time updates to a collection.
    updateWithTimestamp => Updates a document with the current server timestamp.
    updateArrayField => Adds or removes elements from an array field in a document.
    incrementField => Increments or decrements a numeric field value.
    deleteFieldFromDocument => Deletes a specific field from a document.
    queryAndOrder => Queries and orders documents based on specified conditions.
    
This setup ensures that Firestore interactions are well-organized, error-handled, and easy to maintain.

*/