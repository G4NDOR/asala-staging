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
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_CLLECTIONS_NAMES, FIREBASE_COLLECTIONS_QUERY_LIMIT, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DYNAMIC_OUTPUT_NAMES, TIMESTAMP } from '../constants/firebase';
import { getIpAddress } from './retreiveIP_Address';
import DEFAULT_VALUES from '../constants/defaultValues';
import CONSTANTS from '../constants/appConstants';

// Common process to handle errors
const handleError = (error) => {
  console.error("Firebase operation failed: ", error);
  throw new Error(error.message);
};


//get data dated to save to firebase
const getDatedDataForFirebaseDocumentsAdds = (data) => {
  const timestampFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.TIMESTAMP;;
  const datedData = {...data, [`${timestampFieldName}`]: Timestamp.now() };
  return datedData;
}

//deletes id feild from the data since documents have ids by default in firestore
const getDataWithoutId = (data) => {
  const dataWithoutId = data;
  const idFeildName = FIREBASE_DOCUMENTS_FEILDS_NAMES.ID;
  delete dataWithoutId[`${idFeildName}`];
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
const validateDataToStoreInFirebase = (data) => {
  const dataWithoutId = getDataWithoutId(data);
  const dataNotDefault = updateIsDefaultValueFeild(dataWithoutId);
  const datedDataWithoutId = getDatedDataForFirebaseDocumentsAdds(dataNotDefault);
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
  const validatedData = validateDataToStoreInFirebase(data);
  try {
    const docRef = await addDoc(collection(db, collectionName), validatedData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    return '';
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
  const validatedData = validateDataToStoreInFirebase(data);
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
    if (docSnap.exists()) {
      const doc = {id: docSnap.id,...docSnap.data() };
      //console.log("Document data: return", doc);
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
  const productObjListFromLocalStorage = await getProductsListFromFirebaseUsingItemsListInCartObj(itemsListFromLocalStorageCart);//returns [productObj1, productObj2, ...]
  console.log("productObjListFromLocalStorage is: ", productObjListFromLocalStorage);
  // if there's cart info in local storage, use it instead of default value: []
  if (productObjListFromLocalStorage && productObjListFromLocalStorage.length > 0) {
    //there's cart info in local storage
    //if there's no customer id, return cart items from local storage, and that's it
    //not probabal since customer is is also retreived from local storage like cart info 
    //no customerId => probably cookiess have been wiped => cart in local storage is wiped too
    if (!customerId) return productObjListFromLocalStorage;
    //get cart from firebase
    const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
    const fetchedCart = await getDocument(docPath);
    const noCartInFirebase =!fetchedCart;
    const itemsListInCartObjFromFirebase = noCartInFirebase? []: fetchedCart[`${itemsListFeildNameInCartObj}`];//returns [{id:itemId, quantity: itemQuantity},...]
    if (noCartInFirebase) {
      //no cart in firebase, 
      //create a new cart in firebase with local storage cart info, and default values
      const dataToSave = {...defaultCart, [`${itemsListFeildNameInCartObj}`]: itemsListFromLocalStorageCart};
      await setDocument(docPath, dataToSave);
    }else if (JSON.stringify(itemsListInCartObjFromFirebase)!== JSON.stringify(itemsListFromLocalStorageCart)) {
      //cart exists in firebase but not equivilant to cart in local storage, update firebase with cart from local storage,
      // since it is more up to date, (updated on each cart change) 
      //const updates = {[`${itemsListFeildNameInCartObj}`]: itemsListFromLocalStorageCart};       
      await updateCartItemsInFirebaseFromItemsListinCartObj(customerId, itemsListFromLocalStorageCart);
    };
    //if equivilant return cart
    return productObjListFromLocalStorage;
  };
  
  //there's no cart info in local storage => no cart items in firebase, since localStorage is updated more frequent,
  // and it's the only way to recognize a user for now, (no authentication)
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

//updates cart items based on the customer's id
//takes customer id and a list of product obj{id:itemId, quantity: itemQuantity, available: bool,...}
//turns it into a structore to be stored in firebase as a list of {id: itemId, quantity: itemQuantity}
export const updateCartItemsInFirebaseFromProductObjList = async (cartItems) => {
  const customerId = getUserIdFromLocalStorage();
  if (!customerId) return; //if there's no customer id, return
  const docPath = `${FIREBASE_CLLECTIONS_NAMES.CARTS}/${customerId}`;
  const itemsFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.CARTS.ITEMS;
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const cartItemIdFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.ID;
  const cartItemQuantityFieldName = FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.CARTS.ITEMS.QUANTITY;
  const cartItemsList = cartItems.map(item => {
    console.log("itemQuantityFieldName: ", itemQuantityFieldName);
    console.log("item quantity: ", item[`${itemQuantityFieldName}`]);
    const itemObj = {
      [cartItemIdFieldName]: item[`${itemIdFieldName}`],
      [cartItemQuantityFieldName]: item[`${itemQuantityFieldName}`]
    };
    return itemObj;
  });
  const updates = {
    [itemsFieldName]: cartItemsList
  };
  console.log("updates: " , updates);
  await updateDocument(docPath, updates);
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
    const itemQuantity = item[itemQuantityFieldNameInCartObj];
    try {
      //console.log(`Fetching item with ID ${itemId}`);
      const itemDataFromFirebase = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.PRODUCTS}/${itemId}`);
      if (!itemDataFromFirebase) return null; // Return null if item doesn't exist
      return { ...itemDataFromFirebase, quantity: itemQuantity };
    } catch (error) {
      console.error(`Failed to fetch item with ID ${itemId}:`, error);
      return null; // Return null on error
    }
  }));  
  const items = itemsListFromFirebase.filter(item => item!== null); //filter out the not found items
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

//save or update cart item in local storage based on the parameter merge (true to merge, false to replace)
//returns nothing
export const saveOrUpdateCartItemToLocalStorage = (cart, merge = false) => {
  const key = CONSTANTS.LOCAL_STORAGE.KEYS.CART_KEY;
  const itemIdFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID;
  const itemQuantityFieldName = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.QUANTITY;
  const newCart = {};//{itemId1: quantity1, itemId2: quantity2,...}
  cart.map(item => {
    const itemId = item[`${itemIdFieldName}`];
    const itemQuantity = item[`${itemQuantityFieldName}`];
    const itemLocalStorageKey = `${itemId}`;
    newCart[itemLocalStorageKey] = itemQuantity;
  });
  if (!merge){
    console.log("newCart: ", newCart);
    localStorage.setItem(key, JSON.stringify(newCart));//{'cart': {itemId1: quantity1, itemId2: quantity2,...}}
    console.log("Success");
    return;
  }
  const cartLocalStorage = getCartFromLocalStorage();//{itemId1: quantity1, itemId2: quantity2,...}
  localStorage.setItem(key, JSON.stringify({...cartLocalStorage,...newCart}));//{'cart': {itemId1: quantity1, itemId2: quantity2,...}}
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
    const addresses = customerHasAnAddress? customerAddresses : [defaultAddress];
    

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

export const loadProductPageData = async (productId, producerId, recommendationsIds) => {
  let producer = await getDocument(`${FIREBASE_CLLECTIONS_NAMES.PRODUCERS}/${producerId}`);
  const recommendations = await loadRecommendationsForProduct(recommendationsIds);
  const customerReviews = await queryCollection(`${FIREBASE_CLLECTIONS_NAMES.REVIEWS}`, "product-id", "==", productId);

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

export const loadRecommendationsForProduct = async (recommendationsIds) => {
  //console.log('Recommendations ids: ', recommendationsIds);
  if (!recommendationsIds || recommendationsIds.length === 0) return [];
  //console.log('Recommendations not empty: ');
  //const whereField = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.MATCHING_PRODUCTS;
  const recommendations = await getDocumentsByIds(FIREBASE_CLLECTIONS_NAMES.PRODUCTS, recommendationsIds);
  //console.log('Recommendations 1 : ', recommendations);
  if (!recommendations) return [];
  
  return recommendations;
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