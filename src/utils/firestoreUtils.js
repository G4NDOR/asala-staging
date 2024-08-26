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
  deleteField,
  startAfter
} from 'firebase/firestore';
import { FIREBASE_CLLECTIONS_NAMES, FIREBASE_COLLECTIONS_QUERY_LIMIT, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DYNAMIC_OUTPUT_NAMES, TIMESTAMP } from '../constants/firebase';
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
/**
 * Updates an array field in a Firestore document by either adding or removing elements.
 * 
 * @async
 * @function updateArrayField
 * @param {string} docPath - The path to the Firestore document (e.g., 'users/userId').
 * @param {string} field - The name of the array field to update in the document.
 * @param {Array} elements - The elements to add or remove from the array field.
 * @param {string} operation - The operation to perform: 'add' to add elements, 'remove' to remove elements.
 * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
 * 
 * @throws Will throw an error if the Firestore operation fails.
 * 
 * @example
 * // Example 1: Adding elements to an array field
 * const docPath = 'users/user123';
 * const field = 'favorites';
 * const elementsToAdd = ['item1', 'item2'];
 * await updateArrayField(docPath, field, elementsToAdd, 'add');
 * 
 * // Document before: { favorites: ['item3'] }
 * // Document after:  { favorites: ['item3', 'item1', 'item2'] }
 * 
 * @example
 * // Example 2: Removing elements from an array field
 * const docPath = 'users/user123';
 * const field = 'favorites';
 * const elementsToRemove = ['item3'];
 * await updateArrayField(docPath, field, elementsToRemove, 'remove');
 * 
 * // Document before: { favorites: ['item1', 'item2', 'item3'] }
 * // Document after:  { favorites: ['item1', 'item2'] }
 */

const updateArrayField = async (docPath, field, elements, operation) => {
  try {
    const docRef = doc(db, docPath);
    const update = operation === 'add' ? arrayUnion(...elements) : arrayRemove(...elements);
    await updateDoc(docRef, { [field]: update });
  } catch (error) {
    handleError(error);
  }
};

export const addElementsToArrayField = async (docPath, field, elements) => {
  await updateArrayField(docPath, field, elements, 'add');
};

export const removeElementsFromArrayField = async (docPath, field, elements) => {
  await updateArrayField(docPath, field, elements,'remove');
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

// Query and order documents from a Firestore collection
// @param {string} collectionName - The name of the Firestore collection to query.
// @param {string} whereField - The field to filter documents by.
// @param {*} whereValue - The value to compare with the whereField.
// @param {string} orderByField - The field to order the documents by.
// @param {number} limitNum - The maximum number of documents to retrieve.
// @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data including document IDs.
// @example
// // Sample Input:
// const collectionName = 'products';
// const whereField = 'category';
// const whereValue = 'coffee';
// const orderByField = 'price';
// const limitNum = 3;
//
// // Sample Output:
// // [
// //   { id: 'doc1', name: 'Moroccan Coffee', category: 'coffee', price: 5 },
// //   { id: 'doc2', name: 'Espresso', category: 'coffee', price: 7 },
// //   { id: 'doc3', name: 'Cappuccino', category: 'coffee', price: 6 },
// // ]
export const queryAndOrder = async (collectionName, whereField, whereValue, orderByField, limitNum) => {
  try {
    // Create a query against the specified collection, filtering and ordering as required
    const q = query(
      collection(db, collectionName), // Reference to the Firestore collection
      where(whereField, '==', whereValue), // Filter documents where the field equals the specified value
      orderBy(orderByField), // Order the results by the specified field
      limit(limitNum) // Limit the number of results to the specified number
    );

    // Execute the query and get a snapshot of the results
    const querySnapshot = await getDocs(q);

    // Initialize an array to store the data from the documents
    const data = [];

    // Loop through each document in the snapshot and push its data to the array
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Return the array of document data
    return data;
  } catch (error) {
    // Handle any errors that occur during the query
    handleError(error);
  }
};


// Query and order documents with pagination
// @param {string} collectionName - The name of the Firestore collection to query.
// @param {string} whereField - The field to filter documents by.
// @param {*} whereValue - The value to compare with the whereField.
// @param {string} orderByField - The field to order the documents by.
// @param {number} limitNum - The maximum number of documents to retrieve.
// @param {DocumentSnapshot} lastDoc - The last document from the previous query (for pagination).
// @returns {Promise<Object>} - A promise that resolves to an object containing the array of document data and the last document.
// @example
// // Sample Input:
// const collectionName = 'products';
// const whereField = 'category';
// const whereValue = 'coffee';
// const orderByField = 'price';
// const limitNum = 3;
// const lastDoc = null; // or the last document from a previous query
//
// // Sample Output:
// // {
// //   data: [
// //     { id: 'doc1', name: 'Moroccan Coffee', category: 'coffee', price: 5 },
// //     { id: 'doc2', name: 'Espresso', category: 'coffee', price: 7 },
// //     { id: 'doc3', name: 'Cappuccino', category: 'coffee', price: 6 },
// //   ],
// //   lastDoc: <DocumentSnapshot> // The last document in the query results
// // }
export const queryAndOrderWithPagination = async (collectionName, whereField, whereValue, orderByField, limitNum, choose=false, ordered = false, limited=true, lastDoc = null) => {
  try {
    // Create a query against the specified collection, filtering, ordering, and paginating as required
    let q = null;
    if(choose && ordered && limited) {        
      q = query(
      collection(db, collectionName),
      where(whereField, '==', whereValue),
      orderBy(orderByField),
      limit(limitNum)
      );
    } else if (choose && ordered && !limited) {
      q = query(
      collection(db, collectionName),
      where(whereField, '==', whereValue),
      orderBy(orderByField)
      );
    } else if (choose &&!ordered && limited) {
      q = query(
      collection(db, collectionName),
      where(whereField, '==', whereValue),
      limit(limitNum)
      );
    } else if (choose &&!ordered &&!limited) {
      q = query(
      collection(db, collectionName),
      where(whereField, '==', whereValue)
      );
    } else if (!choose && ordered && limited) { 
      q = query(
      collection(db, collectionName),
      orderBy(orderByField),
      limit(limitNum)
      );
    } else if (!choose && ordered &&!limited) {
      q = query(
      collection(db, collectionName),
      orderBy(orderByField)
      );
    } else if (!choose &&!ordered && limited) {
      q = query(
      collection(db, collectionName),
      limit(limitNum)
      );
    } else {
      q = query(
      collection(db, collectionName)
      );
    }


    // If a last document is provided, paginate by starting after it
    if (limited && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Execute the query and get a snapshot of the results
    const querySnapshot = await getDocs(q);

    // Initialize an array to store the data from the documents
    const data = [];

    // Track the last document in the results
    let lastVisibleDoc = null;

    // Loop through each document in the snapshot and push its data to the array
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
      lastVisibleDoc = doc; // Update last visible document
    });

    // Return the array of document data and the last document
    return { data, lastDoc: lastVisibleDoc };
  } catch (error) {
    // Handle any errors that occur during the query
    handleError(error);
  }
};

export const searchByText = async (collectionName, searchText, limitNum, limited = true, lastDoc = null) => {
  try {
    // Create a query against the specified collection, searching for documents containing the searchText
    let q = null;
    if (limited) {
      q = query(
        collection(db, collectionName),
        //where("regions", "array-contains", "west_coast")
        where(FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.KEYWORDS, "array-contains", searchText), 
        limit(limitNum)
      );
    } else {
      q = query(
        collection(db, collectionName),
        where(FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.KEYWORDS, "array-contains", searchText), 
      );
    }

    // If a last document is provided, paginate by starting after it
    if (limited && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }    

    // Execute the query and get a snapshot of the results
    const querySnapshot = await getDocs(q);
    // Initialize an array to store the data from the documents
    const data = [];
    // Track the last document in the results
    let lastVisibleDoc = null;    
    // Loop through each document in the snapshot and push its data to the array
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id,...doc.data() });
      lastVisibleDoc = doc;
    });
    // Return the array of document data
    return {data, lastDoc: lastVisibleDoc};
  } catch (error) {
    // Handle any errors that occur during the query
    handleError(error);
  }
}


/*
/   =================================================================
/   Second level abstraction functions:
/   =================================================================
*/


export const loadHomeData = async () => {
  //const homePageDynamicOutput = await getDocument("dynamic-output/VpFaBNbAGB6jn99KAo6F");

  //================================================================
  // Dynamic output is loaded and prepared here
  //++++++++++++++++++++++++++++++++++++++++++++++++
  //load welcome section images
  const welcomeImagesData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_IMAGES}`);//array of images
  const welcomeImages = welcomeImagesData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`];
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
  const welcomeSectionTitleData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_TITLE}`);
  const welcomeSectionTitle = welcomeSectionTitleData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`];
  //++++++++++++++++++++++++++++++++++++++++++++++++
  //Load welcome section content
  const welcomeSectionContentData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_CONTENT}`);
  const welcomeSectionContent = welcomeSectionContentData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`];




  //================================================================
  //Load announcements section content
  const announcementsFetchedData = await loadAnnouncements();
  const announcementsLastDoc = announcementsFetchedData.lastDoc;
  const announcements = announcementsFetchedData.announcements;
  //Load products section content
  const productsFetchedData = await loadProducts();
  const productsLastDoc = productsFetchedData.lastDoc;
  const products = productsFetchedData.products;
  
  //Load customer id if any
  const ipAddress = await getIpAddress();
  //console.log(`IP Address: ${ipAddress}`);
  const customers = await queryCollection(`${FIREBASE_CLLECTIONS_NAMES.CUSTOMERS}`, "ip-address", "==", ipAddress);
  let customer = DEFAULT_VALUES.CUSTOMER_DETAILS;
  let customerId = DEFAULT_VALUES.CUSTOMER_ID;
  if (customers.length > 0){
    customer = customers[0];
    customerId = customer.id;
  } else {
    //customerId = await addDocument(`${FIREBASE_CLLECTIONS_NAMES.CUSTOMERS}`, { 'ip-address': `${ipAddress}` });
    //customer = { 'ip-address': `${ipAddress}`, 'id': customerId };
  }
  

  const homeData = {
    welcomeImagesSrcs,
    welcomeSectionTitle,
    welcomeSectionContent,
    announcements,
    products,
    //customerId,
    //customer,
    //productsLastDoc,
    //announcementsLastDoc
    // Add more data as needed
  };
  return homeData;
}

//Load products section content
export const loadProducts = async (ladtDoc=null) => {
  let retreivedData = await queryAndOrderWithPagination(`${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}`,FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE,true,'',FIREBASE_COLLECTIONS_QUERY_LIMIT.PRODUCTS,true,false,true,ladtDoc);//getCollection("products");
  let products = retreivedData.data;
  if (!products)
    products = [];
  return {products, lastDoc: retreivedData.lastDoc};
}

export const loadSearchResultsProducts = async (searchQuery, ladtDoc=null) => {
  let retreivedData = await searchByText(FIREBASE_CLLECTIONS_NAMES.PRODUCTS, searchQuery, FIREBASE_COLLECTIONS_QUERY_LIMIT.PRODUCTS, true, ladtDoc);
  let products = retreivedData.data;
  if (!products)
    products = [];
  return {products, lastDoc: retreivedData.lastDoc};
}

export const loadProductPageData = async (productId, producerId) => {
  let producer = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.PRODUCERS}/${producerId}`);
  const customerReviews = await queryCollection(`${FIREBASE_CLLECTIONS_NAMES.REVIEWS}`, "product-id", "==", productId);

  if (!producer) 
    producer = DEFAULT_VALUES.PRODUCER_DETAILS;

  const data = {
    producer,
    customerReviews,
    // Add more data as needed
  };
  return data;
}

export const loadAnnouncements = async (ladtDoc=null) => {
  let retreivedData = await queryAndOrderWithPagination(`${FIREBASE_CLLECTIONS_NAMES.ANNOUNCEMENTS}`,'','','', FIREBASE_COLLECTIONS_QUERY_LIMIT.ANNOUNCEMENTS, false,false,true,ladtDoc);
  let announcements = retreivedData.data;
  if (!announcements)
    announcements = [];
  return { announcements, lastDoc: retreivedData.lastDoc};
}

export const wishItem = (customerId, productId) => {
  return addElementsToArrayField(`${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}/${productId}`, `${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.WISHES}`, [customerId]);
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