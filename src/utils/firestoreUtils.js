// firestoreUtils.js
import { database, db, storage } from './firebaseConfig'; // Import your Firebase configuration
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
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_ADMIN_VARS, FIREBASE_CLLECTIONS_NAMES, FIREBASE_COLLECTIONS_QUERY_LIMIT, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS, FIREBASE_DYNAMIC_OUTPUT_NAMES, PLACING_ORDER, REAL_TIME_DATABASE_COLLECTIONS_NAMES, TIMESTAMP } from '../constants/firebase';
import { getIpAddress } from './retreiveIP_Address';
import DEFAULT_VALUES from '../constants/defaultValues';
import CONSTANTS from '../constants/appConstants';
import { calculateTotalDistance, getCleanedProductId, getCleanedProductsIds, getTimeEstimateBasedOnDistance, getVariantsIdsAndOptionalAdditionsIdsFromProductId, isLocationInRange, isOperatingTime, isSubset } from './appUtils';
import { push, ref, set } from 'firebase/database';
import { ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';

// Common process to handle errors
const handleError = (error) => {
  console.error("Firebase operation failed: ", error);
  throw new Error(error.message);
};


//get data dated to save to firebase
export const getDatedDataForFirebaseDocumentsAdds = (data, exist=true) => {
  const timestampFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.TIMESTAMP;
  const updatedAtFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.UPDATED_AT;
  const datedData = {
    ...data,
    [updatedAtFieldName]: Timestamp.now(),
  };
  // If the document is being created (not existing), add the time-created timestamp
  if (!exist) {
    datedData[timestampFieldName] = Timestamp.now();
    datedData[updatedAtFieldName] = Timestamp.now();
  }  
  return datedData;
}

//deletes id feild from the data since documents have ids by default in firestore
const getDataWithoutId = (data) => {
  const dataWithoutId = data;
  const idFeildName = FIREBASE_DOCUMENTS_FEILDS_NAMES.ID;
  if (idFeildName in dataWithoutId) delete dataWithoutId[`${idFeildName}`];
  return dataWithoutId;
}

//default values are values that are assined by default for the purpose of the client side code to run with no errors of undefined reading
//updates the 'is-default-value' field to false before storing the document, because when they will load from firebase they will be fetched data, not default
/** 
 * @param {Object} data - The data to be updated with default values.
 * @returns {Object} - The updated data with default values.
 */
const updateIsDefaultValueFeild = (data) => {
  const isDefaultValueFeildName = FIREBASE_DOCUMENTS_FEILDS_NAMES.IS_DEFAULT_VALUE;
  const updatedData = {...data, [`${isDefaultValueFeildName}`]: false };
  return updatedData;
}

//validate data to store in firebase
//deletes id property and adds a date property
const validateDataToStoreInFirebase = (data, exist=true) => {
  const dataWithoutId = getDataWithoutId(data);
  const dataNotDefault = updateIsDefaultValueFeild(dataWithoutId);
  const datedDataWithoutId = getDatedDataForFirebaseDocumentsAdds(dataNotDefault, exist);
  return datedDataWithoutId;
}

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
  const validatedData = validateDataToStoreInFirebase(data, false);
  try {
    const docRef = await addDoc(collection(db, collectionName), validatedData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    return '';
    handleError(error);
  }
};


/**
 * Uploads multiple documents to Firestore with individual merge options.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {Array} documents - An array of document objects, each containing data and an optional merge flag.
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise.
 */
export const addDocuments = async (collectionName, documents) => {
  // Validate and prepare the data
  const validatedDocuments = documents.map(docData => ({
    ...validateDataToStoreInFirebase(docData.data, false),
    merge: docData.merge || false
  }));

  try {
    const promises = validatedDocuments.map(async (docData) => {
      if (docData.id) {
        // If there's an ID, use setDoc with the specified merge option
        const documentRef = doc(db, collectionName, docData.id);
        await setDoc(documentRef, docData, { merge: docData.merge });
      } else {
        // Otherwise, add a new document
        await addDoc(collection(db, collectionName), docData);
      }
    });

    // Wait for all operations to complete
    await Promise.all(promises);

    console.log("Documents successfully added/updated");
    return true; // Or return an array of document IDs if needed
  } catch (error) {
    handleError(error);
    return false;
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
  const validatedData = validateDataToStoreInFirebase(data, merge);
  try {
    const docRef = doc(db, docPath);
    await setDoc(docRef, validatedData, { merge });
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
 * returns null if the document does not exist.
 */
export const getDocument = async (docPath) => {
  try {
    const docRef = doc(db, docPath);
    const docSnap = await getDoc(docRef);
    // console.log("=================================================");
    // console.log("docPath: ", docPath);
    // console.log("docSnap.exists(): ", docSnap.exists());
    // console.log("docSnap.id: ", docSnap.id);
    // console.log("docSnap.data(): ", docSnap.data());
    if (docSnap.exists()) {
      const doc = {id: docSnap.id,...docSnap.data() };
      return doc;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    handleError(error);
    return null;
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
    return null;
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
    return;
  } catch (error) {
    handleError(error);
    return;
  }
};

export const addElementsToArrayField = async (docPath, field, elements) => {
  await updateArrayField(docPath, field, elements, 'add');
  return;
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
    return null;
  }
};



// Query and order documents with pagination and multiple where clauses
// @param {string} collectionName - The name of the Firestore collection to query.
// @param {Array<{ field: string, value: any, operation?: string }>} whereClauses - An array of objects with 'field', 'value', and optional 'operation' to filter documents.
// @param {string} orderByField - The field to order the documents by.
// @param {number} limitNum - The maximum number of documents to retrieve.
// @param {boolean} ordered - Whether to order the results or not.
// @param {boolean} limited - Whether to limit the number of results or not.
// @param {DocumentSnapshot} lastDoc - The last document from the previous query (for pagination).
// @returns {Promise<Object>} - A promise that resolves to an object containing the array of document data and the last document.
export const queryAndOrderWithPagination = async (
  collectionName,
  whereClauses = [],
  orderByField = null,
  limitNum = null,
  ordered = false,
  limited = true,
  lastDoc = null
) => {
  try {
    // Create a reference to the collection
    let q = collection(db, collectionName);

    // Helper function to perform batched queries
    const performBatchedQueries = async (field, operation, values) => {
      const batchSize = 30; // Firebase limits the 'in', 'not-in', and 'array-contains-any' queries to 30 elements max
      let batchedData = [];
      let lastBatchDoc = null;

      // Break down the values array into batches and perform queries for each batch
      for (let i = 0; i < values.length; i += batchSize) {
        const batchValues = values.slice(i, i + batchSize);
        let batchQuery = query(q, where(field, operation, batchValues));

        // Apply ordering if requested
        if (ordered && orderByField) {
          batchQuery = query(batchQuery, orderBy(orderByField));
        }

        // Apply limit if requested
        if (limited && limitNum) {
          batchQuery = query(batchQuery, limit(limitNum));
        }

        // Apply pagination if lastDoc is provided
        if (lastBatchDoc) {
          batchQuery = query(batchQuery, startAfter(lastBatchDoc));
        }

        // Execute the batch query
        const batchSnapshot = await getDocs(batchQuery);
        
        // Loop through each document in the snapshot and push its data to the batchedData array
        batchSnapshot.forEach((doc) => {
          batchedData.push({ id: doc.id, ...doc.data() });
          lastBatchDoc = doc; // Update last visible document
        });
      }

      return { data: batchedData, lastDoc: lastBatchDoc };
    };

    // Apply multiple where clauses if provided
    for (let { field, value, operation = '==' } of whereClauses) {
      // If the operation is 'in', 'not-in', or 'array-contains-any', handle batching if necessary
      if (['in', 'not-in', 'array-contains-any'].includes(operation) && Array.isArray(value)) {
        if (value.length > 30) {
          // Perform batched queries if the value array exceeds 30 elements
          const batchedResult = await performBatchedQueries(field, operation, value);
          return batchedResult; // Return the result from the batched queries
        } else {
          // Perform a single query if the value array is within the limit
          q = query(q, where(field, operation, value));
        }
      } else {
        // Apply the where clause normally for other operations
        q = query(q, where(field, operation, value));
      }
    }

    // Apply ordering if requested
    if (ordered && orderByField) {
      q = query(q, orderBy(orderByField));
    }

    // Apply limit if requested
    if (limited && limitNum) {
      q = query(q, limit(limitNum));
    }

    // Apply pagination if lastDoc is provided
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Execute the query and get the snapshot
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
    console.error('Error querying documents: ', error);
    handleError(error);
    return { data: null, lastDoc: null };
  }
};






/**
 * Retrieves documents from a Firestore collection based on a list of IDs.
 *
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {Array<string>} ids - An array of document IDs to retrieve.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data.
 * @throws {Error} If there is an error retrieving the documents.
 */
 export const getDocumentsByIds = async (collectionName, ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('IDs must be a non-empty array.');
  }
  //console.log('array of IDs:', ids);
  //console.log('whereField:', whereField);
  //console.log('collectionName:', collectionName);

    // Create an array of promises
    const promises = ids.map(async (id) => {
      const docPathString = `${collectionName}/${id}`;
      return await getDocument(docPathString);
    });  

  try {
    // Wait for all promises to resolve
    const documents = await Promise.all(promises);
    // Filter out any null results
    //console.log('documents:', documents);
    return documents.filter(doc => doc !== null);
    
    //  const q = query(
    //    collection(db, collectionName),
    //    where(whereField, 'in', ids)
    //  );
    //  const querySnapshot = await getDocs(q);
    //  console.log('querySnapshot:', querySnapshot);
//
    //  return querySnapshot.docs.map(doc => {
    //    console.log('doc:', doc);
    //    return ({
    //      
    //      id: doc.id,
    //      ...doc.data()
    //  })
    //  });
  } catch (error) {
      console.error('Error getting documents by IDs:', error);
      throw error;
      return [];
  }
}





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

const promptToRetry = () => {
  return;
}

// Function to save user ID in local storage
const saveUserIdToLocalStorage = (userId) => {
  const key = CONSTANTS.LOCAL_STORAGE.KEYS.USER_ID_KEY;
  localStorage.setItem(key, userId);
};

// Function to get user ID from local storage
//returns user id if found
//returns null if not found
const getUserIdFromLocalStorage = () => {
  const key = CONSTANTS.LOCAL_STORAGE.KEYS.USER_ID_KEY;
  const userId = localStorage.getItem(key);
  return userId;//null if not found
};

//gets customer by id from firebase
//returns customer object if found
//returns null if not found
const getCustomerById = async (customerId) => {
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CUSTOMERS}/${customerId}`;
  //console.log('docPath:', docPath);
  const customer = await getDocument(docPath);//returns null if not found
  return customer;// returns null if not found
}

//adds a customer to firebase
//returns customer id if successful
//returns null if not successful
const addCustomer = async (customerDetails) => {
  let customerDetailesWithIPAddress = customerDetails;//will update customer details with ip address if any later in code
  const ipAddress = await getIpAddress();
  const ipAddressFeildName = FIREBASE_DOCUMENTS_FEILDS_NAMES.CUSTOMERS.IP_ADDRESS;
  if (ipAddress) customerDetailesWithIPAddress = {...customerDetailesWithIPAddress, [`${ipAddressFeildName}`]: ipAddress };
  const customer = await addDocument(`${FIREBASE_CLLECTIONS_NAMES.CUSTOMERS}`, customerDetailesWithIPAddress);
  const customerNotAdded = (customer == '' || !customer);
  if (customerNotAdded) return null;//returns null if not successful
  return customer;
}

const getOrCreateUser = async () => {
  //Load customer id if any
  let customerId = DEFAULT_VALUES.CUSTOMER_ID;//null
  let customer = DEFAULT_VALUES.CUSTOMER_DETAILS;// id = null
  const customerIdInLocalStorage = getUserIdFromLocalStorage();//returns null if not found
  if (customerIdInLocalStorage) {
    //customer exists in local storage, load it, don't add it again
    const customerInFirebase = await getCustomerById(customerIdInLocalStorage);//returns null if not found
    if(!customerInFirebase) {
      //console.log('Customer not found in firebase, loading from local storage');
      //promptToRetry();// let customer use app (even if his info can't be retreved) as a new customer with default values
      //customer exists but can't fetch it from firebase
      const data = {
        customerId,
        customer
      }
      return data;
    }else{
      customer = customerInFirebase;
      customerId = customerInFirebase.id;
    }
    
  }else {
    //customer doesn't exist, or local storage have been cleaned, add it to firebase
    const customerIdFromFirebase = await addCustomer(customer);
    if (!customerIdFromFirebase) {
      //failed to save customer to firebase
      //promptToRetry(); //let customer use app even without saving his info to firebase
      //customer can't be added to firebase
      const data = {
        customerId,
        customer
      }
      return data;
    }else{
      //customer added to firebase successfully
      saveUserIdToLocalStorage(customerIdFromFirebase);
      customer = {...customer, 'id': customerIdFromFirebase };
      customerId = customerIdFromFirebase;
    }
  }
  const data = {
    customerId,
    customer,
  }
  return data;
}

//gets cart based on the customer's id, returns cart items if found
//returns empty array if not found
const loadCartItemsFromFirebaseAndLocalStorage = async (customerId) => {
  //set a default value for cart items [] // [productObj1, productObj2, ...]
  const defaultCart = DEFAULT_VALUES.CART; 
  const itemsListFeildNameInCartObj = FIREBASE_DOCUMENTS_FEILDS_NAMES.CARTS.ITEMS;
  const defaultCartItems = defaultCart[`${itemsListFeildNameInCartObj}`];
  //get the list of productobj from local storage,// which is [productObj1, productObj2, ...] //same structure stored in firebase
  const cartFromLocalStorage = getCartFromLocalStorage();//returns {itemId1: quantity1, itemId2: quantity2, ...}
  const itemsListFromLocalStorageCart = getItemsListFromLocalStorageCart(cartFromLocalStorage);//returns [{id:itemId, quantity: itemQuantity},...]
  console.log('itemsListFromLocalStorageCart:', itemsListFromLocalStorageCart);
  const productObjListFromLocalStorage = await getProductsListFromFirebaseUsingItemsListInCartObj(itemsListFromLocalStorageCart);//returns [productObj1, productObj2, ...]
  console.log('productObjListFromLocalStorage:', productObjListFromLocalStorage);
  console.log('customerId:', customerId);
  if (!customerId) return defaultCartItems;
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
  // if there's cart info in local storage, use it instead of default value: []
  if (productObjListFromLocalStorage && productObjListFromLocalStorage.length > 0) {
    //there's cart info in local storage
    //check if all products in the cat are still aailable in firebase in terms of:
    // product is realeased to the public/ a present product status/ in operating times for selling/ in-stock
    //get products from firebase and update the above fields, but keep the quantity, price, 
    //const oldProductsIds = itemsListFromLocalStorageCart.map(item => item.id);
    //const cleanedOldProductsIds = getCleanedProductsIds(oldProductsIds);
    //const updatedProducts = await getUpdatedProducts(cleanedOldProductsIds);


    /*
    //if there's no customer id, return cart items from local storage, and that's it
    //not probabal since customer id is also retreived from local storage like cart info 
    //no customerId => probably cookiess have been wiped => cart in local storage is wiped too
    //if (!customerId) return productObjListFromLocalStorage;//comentedd for now, not sure if we need it
    */

    //get cart from firebase
    const fetchedCart = await getDocument(docPath);
    const noCartInFirebase =!fetchedCart;
    const itemsListInCartObjFromFirebase = noCartInFirebase? []: fetchedCart[`${itemsListFeildNameInCartObj}`];//returns [{id:itemId, quantity: itemQuantity},...]
    if (noCartInFirebase) {
      //no cart in firebase, 
      //create a new cart in firebase with local storage cart info, and default values
      await updateCartItemsInFirebaseFromProductObjList(productObjListFromLocalStorage, false)
      //const dataToSave = {...defaultCart, [`${itemsListFeildNameInCartObj}`]: itemsListFromLocalStorageCart};
      //await setDocument(docPath, dataToSave);
    }else if (true){//(fetchedCart['updated-at']!== JSON.parse(localStorage.getItem('updated-at'))) {
      //cart exists in firebase but not equivilant to cart in local storage, update firebase with cart from local storage,
      // since it is more up to date, (updated on each cart change) 
      //const updates = {[`${itemsListFeildNameInCartObj}`]: itemsListFromLocalStorageCart};       
      await updateCartItemsInFirebaseFromProductObjList(productObjListFromLocalStorage, true)
    };
    //if equivilant return cart
    console.log('productObjListFromLocalStorage:', productObjListFromLocalStorage);
    return productObjListFromLocalStorage;
  };
  
  //there's no cart info in local storage => no cart items in firebase, since localStorage is updated more frequent,
  // and it's the only way to recognize a user for now, (no authentication)
  //create a new cart in firebase
  const dataToSave = defaultCart;
  await setDocument(docPath, dataToSave);
  // return default cart items []
  return defaultCartItems;

}
/*
duplicate code, see below
export const updateCartItemsInFirebaseFromProductObjList = async (customerId, productObjList) => {
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const itemIdFieldNameInItemsListInCartObj = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.ID;
  const quantityFieldNameInItemsListInCartObj = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.QUANTITY;
  //const newCart = {};//{itemId1: quantity1, itemId2: quantity2,...}
  const itemsListInCartObj = productObjList.map(item => {
    const itemId = item[`${itemIdFieldName}`];
    const itemQuantity = item[`${itemQuantityFieldName}`];
    const ItemObjInCartItemsList = {
      [`${itemIdFieldNameInItemsListInCartObj}`]: itemId,
      [`${quantityFieldNameInItemsListInCartObj}`]: itemQuantity,
    };
    return ItemObjInCartItemsList;
  });
  const itemsListFeildNameInCartObj = FIREBASE_DOCUMENTS_FEILDS_NAMES.CARTS.ITEMS;
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
  const updates = {[`${itemsListFeildNameInCartObj}`]: itemsListInCartObj};       
  await updateCartItemsInFirebaseFromItemsListinCartObj(docPath, updates);
}
*/

export const loadCustomerReviews = async (productId) => {
  //const reviewsListFeildNameInProductObj = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.REVIEWS;
  //const docPath = `${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}/${productId}`;
  //const fetchedProduct = await getDocument(docPath);
  //const noReviewsInFirebase =!fetchedProduct;
  //if (noReviewsInFirebase) return []; //if no reviews in firebase, return empty array
  //const reviewsListInProductObj = fetchedProduct[`${reviewsListFeildNameInProductObj}`];//returns [{id: reviewId, customerId: customerId, content: reviewContent, rating: reviewRating},...]
  return [];
}

//updates cart items based on the customer's id
//takes customer id and a list of product objs [{id:itemId, quantity: itemQuantity, available: bool,...}, ...]
//turns it into a structure to be stored in firebase as a list of [{id: itemId, quantity: itemQuantity}, ...]
export const updateCartItemsInFirebaseFromProductObjList = async (cartItems, merge) => {
  const customerId = getUserIdFromLocalStorage();
  if (!customerId) return; //if there's no customer id, return
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
  const itemsFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.CARTS.ITEMS;
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const cartItemIdFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.ID;
  const cartItemQuantityFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.QUANTITY;
  const cartItemsList = cartItems.map(item => {
    const itemObj = {
      [cartItemIdFieldName]: item[`${itemIdFieldName}`],
      [cartItemQuantityFieldName]: item[`${itemQuantityFieldName}`]
    };
    return itemObj;
  });
  const updates = {
    [itemsFieldName]: cartItemsList
  };
  await setDocument(docPath, updates, merge);
}

//updates cart items based on the customer's id
//takes customer id and a list of items in cart obj [{id: itemId1, quantity: itemQuantity1}, {id: itemId2, quantity: itemQuantity2},...]]
const updateCartItemsInFirebaseFromItemsListinCartObj = async (customerId, cartItems) => {
  if (!customerId) return; //if there's no customer id, return
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
  const itemsFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.CARTS.ITEMS;
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const cartItemIdFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.ID;
  const cartItemQuantityFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.QUANTITY;
  const cartItemsList = cartItems.map(item => {
    const itemObj = {
      [cartItemIdFieldName]: item[`${itemIdFieldName}`],
      [cartItemQuantityFieldName]: item[`${itemQuantityFieldName}`]
    };
    return itemObj;
  });
  const updates = {
    [`${itemsFieldName}`]: cartItemsList
  };
  await updateDocument(docPath, updates);
}

const getUpdatedVariantsProductObj = (productObj, variantsIds) => {
  //console.log(variantsIds.length == 0)
  let variantDoesNotExist = false;

  //variants in the possibly updated product, fetched from firebase
  const productVariants = productObj.variants;
  //fields that concern the variant model objects, that need to be skipped
  const initialFields = CONSTANTS.VARIANT_KEYS//['id', 'active', 'price', 'add-by-default'];
  //fields that will be updated in the product obj based on the selected variants
  const { id, name, price, variants } = variantsIds.reduce((accumulator, variantId) => {
    //loop through the saved old variantsIds and look if that variant still exists in the updated product, AND has not been set to not active
    console.log('variants: ', productVariants)
    const variant = productVariants.find((variant) => (variant.id === variantId && variant.active));
    //if the variant that the user selected doesn't exist, unselect it and replace it with the default or standard product instead
    console.log('variant: ', variant)
    if (!variant || variant == undefined) {
      variantDoesNotExist = true;
      return accumulator;
    }
    console.log('accumulator: ', accumulator)
    //if it exists, look for the field that it controlls in the product obj
    const field = Object.keys(variant).find((key) => !accumulator.fields.includes(key));
    //add the variant id to the product id
    accumulator.id += `_${variant.id}`;
    //add the value of the variant of the property it controlls to the product name, example tea 12oz, if the variant controlls the size property and its value for it is 12oz
    accumulator.name += `_${variant[field]}`;
    //if its price is not null => the smallest child variant => get its price instead of the product price
    if (variant.price) accumulator.price = variant.price;
    //mark this field as used
    accumulator.fields.push(field);
    //add the variant to the product variants array
    accumulator.variants.push(variant);
    return accumulator;
  }, { id: productObj.id, name: productObj.name, price: productObj.price, fields: initialFields, variants: [] });


  if(variantDoesNotExist || variantsIds.length == 0) {
    //console.log("returning original productObj");
    return productObj
  };

  const updatedProducts = {...productObj, id, name, price, variants: variants };
  return updatedProducts;
}

const getUpdatedOptionalAdditionsProductObj = (productObj, optionalAdditionsIds) => {
  let id = productObj.id;
  let price = productObj.price;
  const productOptionalAdditions = productObj['optional-additions'];
  const optionalAdditions = [];
  optionalAdditionsIds.map((optionalAdditionId, i) => {
    console.log('optionalAdditionId:', optionalAdditionId);
    const optionalAddition = productOptionalAdditions.find((optionalAddition) => (optionalAddition.id === optionalAdditionId && optionalAddition.active));
    console.log('optionalAddition:', optionalAddition);
    if (!optionalAddition) return;
    id += `_${optionalAddition.id}`;
    price += optionalAddition.price;
    optionalAdditions.push(optionalAddition);
  });
  const updatedProduct = {...productObj, id, price, 'optional-additions': optionalAdditions };
  console.log('updatedProducts:', updatedProduct);
  return updatedProduct;
}

// returns products list in [productObj1, productObj2,...] form,
// using items list in cart obj  [{id:itemId1, quantity: itemQuantity1}, {id:itemId2, quantity: itemQuantity2},...]
//returns an empty array if no items found
const getProductsListFromFirebaseUsingItemsListInCartObj = async (itemsListInCartObj) => {
  if (!itemsListInCartObj || itemsListInCartObj.length === 0) return []; //if there's no items list, return empty array
  const itemIdFieldNameInCartObj = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.ID;
  const itemQuantityFieldNameInCartObj = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.QUANTITY;  
  // Use Promise.all to fetch all items in parallel
  const itemsListFromFirebase = await Promise.all(itemsListInCartObj.map(async (item) => {
    const itemId = item[`${itemIdFieldNameInCartObj}`];
    const cleanedItemId = getCleanedProductId(itemId);
    const itemQuantity = item[itemQuantityFieldNameInCartObj];
    try {
      // Fetch item data from Firebase
      const itemDataFromFirebase = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}/${cleanedItemId}`);
      // Return null if item doesn't exist
      if (!itemDataFromFirebase) return null;
      // Update quantity field in item data from Firebase with the provided quantity in cart obj
      console.log('item id:', itemId);  
      const combinedIds = getVariantsIdsAndOptionalAdditionsIdsFromProductId(itemId);
      console.log('combinedIds:', combinedIds);
      const selectedVariantsIds = combinedIds[CONSTANTS.UNIQUE_IDS.VARIANT.type];
      const selectedOptionalAdditionsIds = combinedIds[CONSTANTS.UNIQUE_IDS.OPTIONAL_ADDITION.type];
      console.log('selectedOptionalAdditionsIds:', selectedOptionalAdditionsIds);
      const productWithUpdatedVariants = getUpdatedVariantsProductObj(itemDataFromFirebase, selectedVariantsIds);
      const productWithUpdatedOptionalAdditions = getUpdatedOptionalAdditionsProductObj(productWithUpdatedVariants, selectedOptionalAdditionsIds);


      return { ...productWithUpdatedOptionalAdditions, quantity: itemQuantity };
    } catch (error) {
      console.error(`Failed to fetch item with ID ${cleanedItemId}:`, error);
      return null; // Return null on error
    }
  }));  
  console.log('itemsListFromFirebase:', itemsListFromFirebase);
  const items = itemsListFromFirebase.filter(item => item!== null); //filter out the not found items
  //TO DO: remove duplicates from items (if any)
  return items;

}


//returns cart from local storage {itemId1: quantity1, itemId2: quantity2,...}
//or returns empty object if no cart found in local storage
const getCartFromLocalStorage = () => {
  const key = CONSTANTS.LOCAL_STORAGE.KEYS.CART_KEY;
  const cart = JSON.parse(localStorage.getItem(key));
  return cart || {};
}

//turns cart saved in local storage into itemsList to be saved in firebase storage
//{'itemId1': quantity1, itemId2: quantity2,...} => [{'id': itemId, 'quantity': quantity}, ...]
//returns empty array if no cart found in local storage
const getItemsListFromLocalStorageCart = (localStorageCart) => {
  if (!localStorageCart || Object.keys(localStorageCart).length === 0) return []; 
  // Convert to a list of { id, quantity } objects
  const itemsList = Object.entries(localStorageCart).map(([id, quantity]) => {
    return { id, quantity };
  });
  return itemsList;
}

const getCartItemModelsFromProductObjs = (productList) => {
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const newCart = {};//{itemId1: quantity1, itemId2: quantity2,...}
  productList.map(item => {
    const itemId = item[`${itemIdFieldName}`];
    const itemQuantity = item[`${itemQuantityFieldName}`];
    const itemLocalStorageKey = `${itemId}`;
    newCart[itemLocalStorageKey] = itemQuantity;
  });  
  return newCart;
}

//save or update cart item in local storage based on the parameter merge (true to merge, false to replace)
//returns nothing
export const saveOrUpdateCartItemToLocalStorage = (cart, merge = false) => {
  const key = CONSTANTS.LOCAL_STORAGE.KEYS.CART_KEY;
  const updatedAtKey = 'updated-at';

  const newCart = getCartItemModelsFromProductObjs(cart);
  if (!merge){
    localStorage.setItem(key, JSON.stringify(newCart));//{'cart': {itemId1: quantity1, itemId2: quantity2,...}}
    localStorage.setItem(updatedAtKey, JSON.stringify(Timestamp.now())); 
    console.log('updated local cart: ', newCart)
    return;
  }
  const cartLocalStorage = getCartFromLocalStorage();//{itemId1: quantity1, itemId2: quantity2,...}
  
  localStorage.setItem(key, JSON.stringify({...cartLocalStorage,...newCart}));//{'cart': {itemId1: quantity1, itemId2: quantity2,...}}
  localStorage.setItem(updatedAtKey, JSON.stringify(Timestamp.now())); 
  return;
}


export const loadHomeData = async () => {
  try {
      //const homePageDynamicOutput = await getDocument("dynamic-output/VpFaBNbAGB6jn99KAo6F");

    //================================================================
    // Dynamic output is loaded and prepared here
    //++++++++++++++++++++++++++++++++++++++++++++++++
    //load welcome section images
    const welcomeImagesData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_IMAGES}`);//array of images
    const welcomeImagesPaths = welcomeImagesData? welcomeImagesData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`].map(image => {
      return image['image-ref'];
    }): null;
    const welcomeImagesSrcs = welcomeImagesPaths? (await getImages(welcomeImagesPaths)): null;
    //sample image object
    //image = {
    //  'title': "Welcome",
    //  'image-src': "url",
    //  'description': "Welcome",
    //}
    
    //++++++++++++++++++++++++++++++++++++++++++++++++
    //Load welcome section title
    const welcomeSectionTitleData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_TITLE}`);
    const titleDefaultValue = DEFAULT_VALUES.TITLE;
    const welcomeSectionTitle = welcomeSectionTitleData? welcomeSectionTitleData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`]: titleDefaultValue;
    //++++++++++++++++++++++++++++++++++++++++++++++++
    //Load welcome section content
    const welcomeSectionContentData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.DYNAMIC_OUTPUT}/${FIREBASE_DYNAMIC_OUTPUT_NAMES.HOME_PAGE_WELCOME_SECTION_CONTENT}`);
    const contentDefaultValue = DEFAULT_VALUES.CONTENT;
    const welcomeSectionContent = welcomeSectionContentData? welcomeSectionContentData[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DYNAMIC_OUTPUT.CONTENT}`]: contentDefaultValue;




    //================================================================
    //Load admin controlled variables
    const path = FIREBASE_ADMIN_VARS.PATH;
    const admin = await getDocument(path);
    if (!admin) return null;
    const {['base-delivery-fee']:baseDeliveryFee,
    ['base-delivery-distance']: baseDeliveryDistance,
    ['delivery-price-per-mile']: deliveryPricePerMile,
    ['tax-fee']: taxFee,
    email,
    website,
    ['return-policy']: returnPolicy,
    ['phone-number']: phoneNumber,
    ['delivery-speed']: deliverySpeed } = admin;
    console.log('admin:', admin);
    //Load general delivery range
    const deliveryRangeData = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.RANGES}/${DEFAULT_VALUES.GENERAL_RANGE.ID}`);
    const deliveryRangeDefaultValue = DEFAULT_VALUES.GENERAL_RANGE.DATA;
    const deliveryRange = deliveryRangeData? deliveryRangeData: deliveryRangeDefaultValue;
    //Load announcements section content
    const announcementsFetchedData = await loadAnnouncements();
    const announcementsLastDoc = announcementsFetchedData.lastDoc;
    const announcements = announcementsFetchedData.announcements;
    //Load products section content
    const productsFetchedData = await loadProducts();
    const productsLastDoc = productsFetchedData.lastDoc;
    const products = productsFetchedData.products;
    
    //Load customer id if any
    const customerData = await getOrCreateUser();
    const customerId = customerData.customerId;//null by default
    const customer = customerData.customer;//null by default
    //load costumer's cart
    const cart = await loadCartItemsFromFirebaseAndLocalStorage(customerId);
    //Select one of the customer's addresses by default if any
    const addressesFeildName = FIREBASE_DOCUMENTS_FEILDS_NAMES.CUSTOMERS.ADDRESSES;
    const addressStringFeildName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CUSTOMERS.ADDRESSES.STRING;
    const customerAddresses = customer[addressesFeildName].map(address => address[`${addressStringFeildName}`]);
    const customerHasAnAddress = customerAddresses.length > 0;
    const defaultAddress = DEFAULT_VALUES.CUSTOMER_DETAILS[addressesFeildName][0];
    const addresses = customerAddresses;//customerHasAnAddress? customerAddresses : [defaultAddress];
    

    const homeData = {
      welcomeImagesSrcs,
      welcomeSectionTitle,
      welcomeSectionContent,
      announcements,
      products,
      customerId,
      customer,
      addresses,
      productsLastDoc,
      announcementsLastDoc,
      cart,
      deliveryRange,
      baseDeliveryFee,
      baseDeliveryDistance,
      deliveryPricePerMile,
      taxFee,
      email,
      website,
      returnPolicy,
      phoneNumber,
      deliverySpeed
      // Add more data as needed
    };
    //console.log('returning home data: ', homeData);
    return homeData;
} catch (error) {
  // Handle any errors that occur during the query
  console.error('Error loading home data:', error);
  return null;
  }
  
}

//Load products section content
export const loadProducts = async (lastDoc=null) => {
  const collectionName = FIREBASE_CLLECTIONS_NAMES.PRODUCTS;
  const whereClauses = [];
  const orderByField = null;
  const limitNum = FIREBASE_COLLECTIONS_QUERY_LIMIT.PRODUCTS;
  const ordered = false;
  const limited = true;
  const availableFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE;
  whereClauses.push({field: availableFieldName, operation: "==", value: true});
  let retreivedData = await queryAndOrderWithPagination(collectionName, whereClauses, orderByField, limitNum, ordered, limited, lastDoc);
  let products = retreivedData.data;
  if (!products)
    products = [];
  return {products, lastDoc: retreivedData.lastDoc};
}

export const loadSearchResultsProducts = async (searchQuery, lastDoc=null) => {
  //await searchByText(, searchQuery, , true, lastDoc);
  const collectionName = `${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}`;
  const whereClauses = [];
  const orderByField = null;
  const limitNum = FIREBASE_COLLECTIONS_QUERY_LIMIT.PRODUCTS;
  const ordered = false;
  const limited = true;

  const arrayContainsOperation = "array-contains";
  const keywordsFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.KEYWORDS;
  whereClauses.push({field: keywordsFieldName, operation: arrayContainsOperation, value: searchQuery});
  const equalsOperation = "==";
  const availableFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE;
  whereClauses.push({field: availableFieldName, operation: equalsOperation, value: true});
  let retreivedData = await queryAndOrderWithPagination(collectionName, whereClauses, orderByField, limitNum, ordered, limited, lastDoc);
  let products = retreivedData.data;
  if (!products)
    products = [];
  return {products, lastDoc: retreivedData.lastDoc};
}

export const loadProductPageData = async (productId, producerId, recommendationsIds) => {
  let producer = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.PRODUCERS}/${producerId}`);
  const recommendations = await loadRecommendationsForProduct(recommendationsIds);
  const customerReviews = await loadCustomerReviews(productId);//await queryCollection(`${FIREBASE_CLLECTIONS_NAMES.REVIEWS}`, "product-id", "==", productId);

  if (!producer) 
    producer = DEFAULT_VALUES.PRODUCER_DETAILS;

  const data = {
    producer,
    customerReviews,
    recommendations
    // Add more data as needed
  };
  return data;
}

export const loadAnnouncements = async (lastDoc=null) => {
  const collectionName = FIREBASE_CLLECTIONS_NAMES.ANNOUNCEMENTS;
  const whereClauses = [];
  const orderByField = null;
  const limitNum = FIREBASE_COLLECTIONS_QUERY_LIMIT.ANNOUNCEMENTS;
  const ordered = false;
  const limited = true;
  let retreivedData = await queryAndOrderWithPagination(collectionName, whereClauses, orderByField, limitNum, ordered, limited, lastDoc);
  let announcements = retreivedData.data;
  if (!announcements)
    announcements = [];
  return { announcements, lastDoc: retreivedData.lastDoc};
}

export const wishItem = (customerId, productId) => {
  return addElementsToArrayField(`${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}/${productId}`, `${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.WISHES}`, [customerId]);
}

// Load recommendations for a product based on recommendation IDs
// @param {Array<string>} recommendationsIds - An array of product IDs to fetch recommendations for.
// @returns {Promise<Array<Object>>} - A promise that resolves to an array of recommendation documents.
export const loadRecommendationsForProduct = async (recommendationsIds) => {
  // Return an empty array if no recommendation IDs are provided
  if (!recommendationsIds || recommendationsIds.length === 0) return [];

  try {
    // Define the collection name
    const collectionName = FIREBASE_CLLECTIONS_NAMES.PRODUCTS;

    // Generate document paths from recommendation IDs
    const documentPaths = recommendationsIds.map(id => `${collectionName}/${id}`);

    // Fetch documents by paths using Promise.all
    const fetchDocuments = documentPaths.map(async (path) => {
      const docRef = doc(db, path);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      // Check if the document exists and meets all criteria
      if (
        docSnap.exists() &&
        data?.available === true &&
        data?.['in-stock'] === true &&
        data?.status === 'present' && // Check if status is exactly 'present'
        isOperatingTime(data.schedule) // Check if current time is within operating time
      ) {
        return { id: path.split('/').pop(), ...data };
      } else {
        return null;
      }
    });

    // Wait for all fetch operations to complete
    const results = await Promise.all(fetchDocuments);

    // Filter out null results (documents that did not meet the criteria)
    const recommendations = results.filter(doc => doc !== null);

    // Return the fetched recommendations
    return recommendations;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error loading recommendations: ', error);
    return []; // Return an empty array in case of error
  }
};




export const loadDiscountsFromFirebase = async (customerId, productsIds) => {
  const collectionName = `${FIREBASE_CLLECTIONS_NAMES.DISCOUNTS}`;
  const whereClauses = [];
  const orderByField = null;
  const limitNum = null;
  const ordered = false;
  const limited = false;
  const lastDoc = null;

  const inOperation = 'in';
  //check for discounts that belong to this customer or the discounts that are public for all customers.
  //whether the customer field in dicount document matches the customerId or the public dicount 'all'.
  const customerFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.CUSTOMER;
  const publicDiscountName = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.CUSTOMER.ALL;
  const CustomerFieldOptions = [customerId, publicDiscountName];
  whereClauses.push({field: customerFieldName, operation: inOperation, value: CustomerFieldOptions});
  //check for discounts that apply to those products or the discounts that are general and apply to all products
  //whether the products field in dicount document matches any one of those products' ids or the general dicount 'all'.
  
  const productsFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.PRODUCT;
  const generalDicountName = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.PRODUCT.ALL;
  const ProductsFieldOptions = [ generalDicountName, ...productsIds]
  whereClauses.push({field: productsFieldName, operation: inOperation, value: ProductsFieldOptions});
  //get only the active discounts not the desactivated ones.
  const equalToOperation = '==';
  const activeFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.ACTIVE;
  whereClauses.push({field: activeFieldName, operation: equalToOperation, value: true});
  
  const retreivedData = await queryAndOrderWithPagination(collectionName, whereClauses, orderByField, limitNum, ordered, limited, lastDoc);
  let discounts = retreivedData.data;
  if (!discounts)
    discounts = [];
  return discounts;
}

/**
 * Fetches product objects from the Firestore 'products' collection for the given array of product IDs.
 * Since Firestore's 'in' operation can only handle a maximum of 30 elements at a time, this function
 * splits the array into batches of 30 IDs and queries the Firestore collection in parallel for each batch.
 * 
 * @param {Array<string>} productIds - An array of product IDs to fetch from the Firestore collection.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of product objects.
 */
export const getUpdatedProducts = async (productIds) => {
  const products = [];
  const BATCH_SIZE = 30;
  let batchPromises = [];

  // Split the productIds array into batches of 30
  for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
    const batch = productIds.slice(i, i + BATCH_SIZE);

    // Prepare the where clause for this batch
    const whereClauses = [{ field: 'id', value: batch, operation: 'in' }];

    // Add the batch query to the promises array
    batchPromises.push(
      queryAndOrderWithPagination('products', whereClauses)
    );
  }

  try {
    // Execute all batch queries concurrently
    const results = await Promise.all(batchPromises);

    // Combine the results from all batches
    results.forEach(result => {
      if (result.data) {
        products.push(...result.data);
      }
    });
  } catch (error) {
    console.error('Error fetching products: ', error);
    handleError(error);
  }

  return products;
};


export const createOrder = async (order) => {
    //receipt-url set it in fireUtils.js
    //delivery-commission set it in fireUtils.js
    //deliverer-id set it in fireUtils.js 
    //const orders = Object.entries(ItemsObject).map(([merchantId, items]) => {
    //  const origin = items[0].producer.location;
    //  const distance = haversineDistance(origin, geopoint);
    //  return {
    //      ...orderBase,
    //      producer: merchantId,
    //      origin: origin,    
    //      items: items,
    //      'expected-delivered-at': getTimeEstimateBasedOnDistance(distance, deliverySpeed),
    //      'expected-ready-at':  getMaxTimeEstimateBasedOnPrepTimes(items),    
    //  }
    //  })    
    //;  
  const ordersCollectionName = REAL_TIME_DATABASE_COLLECTIONS_NAMES.ORDERS
  const ordersRef = ref(database, ordersCollectionName);
  const newOrderRef = push(ordersRef);
  // Get the unique ID generated by push()
  const newOrderId = newOrderRef.key;  
  const datedData = validateDataToStoreInFirebase(order, false);
  return set(newOrderRef, datedData).then(() => {
    console.log("Order created successfully!");
    return newOrderId;
  }).catch((error) => {
    console.error("Error creating order: ", error);
    handleError(error);
    return null;
  });

}


// Perform validation and check if all firestore data is matching with the current order object.
export const tryPlacingOrder = async (order) => {
  if (!order ||!order.items ||!order.destination) return null;
  const items = order.items
  const destination = order.destination;
  try {
    //ADMIN
    //First, check if placing orders currently is allowed by the admin
    const path = FIREBASE_ADMIN_VARS.PATH;
    const adminVars = await getDocument(path);
    if (!adminVars || !adminVars[FIREBASE_ADMIN_VARS.PLACING_ORDER_ALLOWED]) return null;
    //Then, check if the order is valid by checking if the destination is valid, and the products can be bought at the moment.
    const general = FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.RANGES.GENERAL;
    const products = FIREBASE_CLLECTIONS_NAMES.PRODUCTS;
    const _deliverer = FIREBASE_DOCUMENTS_FEILDS_NAMES.RANGES.DELIVERER;
    const _commission = FIREBASE_DOCUMENTS_FEILDS_NAMES.DELIVERERS.COMMISSION
    const _deliverers = FIREBASE_CLLECTIONS_NAMES.DELIVERERS;
    const _value = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.DELIVERERS.COMMISSION.VALUE;
    const _speedInKmph = FIREBASE_DOCUMENTS_FEILDS_NAMES.DELIVERERS.SPEED_IN_KMPH
    const _variants = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.VARIANTS;
    const _optionalAdditions = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.OPTIONAL_ADDITIONS;
    const _price = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PRICE;
    const _name = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME;
    const ranges = {};
    const rangesIds = [];
    const quantities = {};
    const productsPaths = [];
    const merchantsSpecificOrder = {};
    const itemsListMini = {};
    const deliverers = [];
    //LOOP ITEMS
    //loop through the items and build the necessary data structures.
    items.map(item => {
      itemsListMini[item.id] = {
        id: item.id,
        name: item[_name],
        quantity: item.quantity,
        variants: item[_variants],
        [_optionalAdditions]: item[_optionalAdditions],
        price: item[_price],
      }
      //gather all the ranges ids that are specified in the item.range, except for the general one, since we alredy know it's id
      if (!rangesIds.includes(item.range) && item.range !== general) rangesIds.push(item.range);
      //since each product variant or product with different optional additons has its own id,
      //we need to get the cleaned ID, the id of the original product, then we can count the real quantity.
      //where productX variant1 and productX variant2 will be counted as one product with quantity of 2
      //this is necessary so we can check if we have enough stock before allowing the purchase. 
      const cleanedId = getCleanedProductId(item.id);
      quantities[cleanedId] = item.quantity + (quantities[cleanedId] || 0);
      //and then we get the path for this product for conveniancy to use later
      const path = {
        path: `${products}/${cleanedId}`,
        id: item.id,
      };
      if (!productsPaths.includes(path)) productsPaths.push(path);      
    });
    //after gathering the ranges, we add the general range to the ranges [],
    const generalRangeId = DEFAULT_VALUES.GENERAL_RANGE.ID;
    rangesIds.push(generalRangeId);
    //RANGES
    //we fetch the ranges and store them in an object with (range id: range) pairs, with  the id: 'general' for the general range, since that is what it is specified with in product.range
    const fetchRangesDocuments = rangesIds.map(async (rangeId) => {
      const isGeneralRange = rangeId === generalRangeId;
      const path = `${FIREBASE_CLLECTIONS_NAMES.RANGES}/${rangeId}`;
      const range = await getDocument(path);
      const key = isGeneralRange? general:rangeId;
      //if there's any unfound document, set the range to null, as it will be treated later when we fetch the products.
      //and if the range is fetched successfully, IF NOT set it to null.
      //check if it has the deliverer field IF NOT set it to null.
      if (!range || !range[_deliverer]) {
        console.log(`Range ${rangeId} not found or has no deliverer.`);
        ranges[key] = null;
        return;
      };
      //fetch the deliverer document
      //check if the deliverer document exists and has the commission and speed fields IF NOT set it to null.
      const delivererPath = `${_deliverers}/${range[_deliverer]}`;
      // console.log('deliverer path: ' + delivererPath);
      const deliverer = await getDocument(delivererPath);
      if (!deliverer || !deliverer[_commission] || !deliverer[_speedInKmph]) {
        console.log(`Deliverer ${range[_deliverer]} not found or has no commission or speed.`);
        ranges[key] = null;
        return;
      };//console: deliverers/5PTLKNYRl10Aqv4ppKkM
      // firestore: deliverers/5PTLKNYRl10Aqv4ppKkM
      //then add the commission and speed to the ranges object.
      // set it to the ranges object.          
      const commission = deliverer[_commission][_value];
      const speed = deliverer[_speedInKmph];
      //if its a the general range, use 'general' as it's key, otherwise use the rangeId as the key.
      ranges[key] = {...range, commission, speed};
    });
    await Promise.all(fetchRangesDocuments);
    //check if all items are found
    // are released to public
    // are present items not future
    // in operating time
    // in stock/ have enough stock
    //all ranges are found
    // destination is within all those ranges
    const future = FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.future;
    const inStock = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IN_STOCK;
    const available = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE;
    const statusField = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS;
    const schedule = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.SCHEDULE;
    const stock = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STOCK;
    const _range = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.RANGE;
    const _producer = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PRODUCER;
    const _producerId = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.PRODUCER.ID;
    const _producerLocation = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.PRODUCER.LOCATION;
    const _prepTimeInMinutes = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES
    const rejected = PLACING_ORDER.STATUS.REJECTED;
    const accepted = PLACING_ORDER.STATUS.ACCEPTED;
    //CHECK PRODUCTS
    const fetchProductsDocuments = productsPaths.map(async (pathObj) => {
      const productId = pathObj.id;
      const path = pathObj.path;
      //const docRef = doc(db, path);
      const product = await getDocument(path);
      console.log('itemsListMini: ', itemsListMini);
      const range = ranges[product[_range]];
      if (!product) {
        const reason = PLACING_ORDER.REASONS.PRODUCT_NOT_FOUND;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (product[available] === false) {
        const reason = PLACING_ORDER.REASONS.UNAVAILABLE;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (product[statusField] === future) {
        const reason = PLACING_ORDER.REASONS.IS_FUTURE_PRODUCT;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (!isOperatingTime(product[schedule])) {
        const reason = PLACING_ORDER.REASONS.NOT_OPERATING_TIME;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (product[inStock] === false) {
        const reason = PLACING_ORDER.REASONS.OUT_OF_STOCK;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (product[stock] < quantities[productId]) {
        const reason = PLACING_ORDER.REASONS.INSUFFICIENT_STOCK;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (!range) {
        const reason = PLACING_ORDER.REASONS.RANGE_NOT_FOUND;
        return {
          productId,
          status: rejected,
          reason,
        }        
      } else if (!isLocationInRange( destination, range)){
        const reason = PLACING_ORDER.REASONS.OUT_OF_RANGE;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (!isSubset(product[_variants], itemsListMini[productId][_variants])) {
        console.log('variants not found: ', product[_variants], itemsListMini[productId][_variants])
        const reason = PLACING_ORDER.REASONS.VARIANTS_NOT_FOUND;
        return {
          productId,
          status: rejected,
          reason,
        }
      } else if (!isSubset(product[_optionalAdditions], itemsListMini[productId][_optionalAdditions])) {
        const reason = PLACING_ORDER.REASONS.OPTIONAL_ADDITIONS_NOT_FOUND;
        return {
          productId,
          status: rejected,
          reason,
        }
      }
      const origin = product[_producer][_producerLocation];
      const distance = calculateTotalDistance([destination, origin, destination]);
      //if all checks passed, accept the order. and start preparing order structure to store in real time database.
      if (`${product[_producer][_producerId]}` in merchantsSpecificOrder) {
        merchantsSpecificOrder[product[_producer][_producerId]] = {
          ...merchantsSpecificOrder[product[_producer][_producerId]],
          items: [...merchantsSpecificOrder[product[_producer][_producerId]]['items'], itemsListMini[productId]],
          'delivery-time': Math.max(merchantsSpecificOrder[product[_producer][_producerId]]['delivery-time'], getTimeEstimateBasedOnDistance(distance, range.speed)),
          'prep-time':  Math.max(merchantsSpecificOrder[product[_producer][_producerId]]['prep-time'], product[_prepTimeInMinutes]),

        }
      } else {
        const deliverer = range[_deliverer]
        deliverers.push(deliverer);
        merchantsSpecificOrder[product[_producer][_producerId]] = {
          producer: product[_producer][_producerId],
          origin: origin,
          items: [itemsListMini[productId]],
          'delivery-time': getTimeEstimateBasedOnDistance(distance, range.speed),
          'prep-time':  product[_prepTimeInMinutes],
          'delivery-commission': range.commission,
          deliverer: deliverer,
          //notes: ,
          status: order.status,
        }
      }
      return {
        productId,
        status: accepted,
      }
    })
    const result = await Promise.all(fetchProductsDocuments);  
    //an array of all the rejected products ids, with the reason of rejection.
    const rejectedProductsResults = result.filter(result=> {
      if (result.status === PLACING_ORDER.STATUS.REJECTED) return true;
      return false;
    })
    //if there's any rejections, then prevent placing the order, and return the reasons.
    if (rejectedProductsResults.length > 0) {
      return {status: PLACING_ORDER.STATUS.REJECTED, data: rejectedProductsResults}
    }
    //if everything is good, finish placing the order
    const { items: _, ...DatabaseOrder} = {...order, ...merchantsSpecificOrder, deliverers};
    const response = await createOrder(DatabaseOrder);
    if (!response) return null;
    return {status: PLACING_ORDER.STATUS.ACCEPTED, response}
  } catch (error) {
    console.error('Error checking placing order: ', error);
    handleError(error);
    return null;
  }
}

export const getImages = async (imagesPaths) => {
  if (imagesPaths.length === 0) return null;

  // Use `map` to create an array of promises
  const getFiles = imagesPaths.map(async (path) => {
    const fileRef = storageRef(storage, `${path}`);

    try {
      const url = await getDownloadURL(fileRef);
      console.log('File URL:', url);
      return url;
    } catch (error) {
      console.error("Error downloading file", error);
      handleError(error);
      return null;
    }    
  });

  // Await all promises
  const imagesUrls = (await Promise.all(getFiles)).filter(url => url !== null);

  if (imagesUrls.length === 0) return null;

  // Return the image URLs, either an array or a single URL
  return imagesUrls;
}



/*
const images = [
  { file: imageFile1, path: 'images/user1/profile.jpg' },
  { file: imageFile2, path: 'images/user1/cover.jpg' }
];
const uploadedUrls = await uploadImages(images);
console.log('Uploaded URLs:', uploadedUrls);

*/
export const uploadImages = async (images) => {
  if (images.length === 0) return null;

  // Use `map` to create an array of promises for each file upload
  const uploadPromises = images.map(async (image) => {
    const { file, path } = image; // file is the actual image file, path is the storage path
    const fileRef = storageRef(storage, `${path}`);

    try {
      // Upload the file to the specified path
      const snapshot = await uploadBytes(fileRef, file);
      console.log(`Uploaded file to: ${path}`);

      // Get the download URL after upload
      const url = await getDownloadURL(snapshot.ref);
      console.log('File URL:', url);
      return url;
    } catch (error) {
      console.error("Error uploading file", error);
      handleError(error);
      return null;
    }
  });

  // Await all promises and filter out any failures (nulls)
  const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);

  if (uploadedUrls.length === 0) return null;

  // Return the image URLs, either an array or a single URL
  return uploadedUrls;
};



/*
const imagePaths = ['images/user1/profile.jpg', 'images/user1/cover.jpg'];
const deletedFiles = await deleteImages(imagePaths);
console.log('Deleted Files:', deletedFiles);
*/
export const deleteImages = async (imagesPaths) => {
  if (imagesPaths.length === 0) return null;

  // Use `map` to create an array of promises for each file delete
  const deletePromises = imagesPaths.map(async (path) => {
    const fileRef = storageRef(storage, `${path}`);

    try {
      // Delete the file at the specified path
      await deleteObject(fileRef);
      console.log(`Deleted file at: ${path}`);
      return path;
    } catch (error) {
      console.error("Error deleting file", error);
      handleError(error);
      return null;
    }
  });

  // Await all promises and filter out any failures (nulls)
  const deletedFiles = (await Promise.all(deletePromises)).filter(path => path !== null);

  if (deletedFiles.length === 0) return null;

  // Return the paths of successfully deleted files
  return deletedFiles;
};



/*


  */

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