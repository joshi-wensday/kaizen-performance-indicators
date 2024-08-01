# Integration Guide for Kaizen-PIs Library

**Version: 1.0.3**

This guide provides examples and best practices for integrating the Kaizen-PIs Library into your application's state management and data storage solutions.

## Data Structuring

When using the Kaizen-PIs Library, you'll be working with three main types of data: KPIs, Logs, and Patches. Here's a suggested structure for storing this data:

### Cloud Storage (e.g., Firestore)

```
kaizen-pis/
├── kpis/
│   ├── [kpi-id-1]/
│   │   ├── name: string
│   │   ├── category: string
│   │   ├── dataType: string
│   │   ├── conversionRule: object
│   │   └── patchVersion: string
│   └── [kpi-id-2]/
│       └── ...
├── logs/
│   ├── [log-id-1]/
│   │   ├── date: timestamp
│   │   ├── patchVersion: string
│   │   └── entries: array
│   └── [log-id-2]/
│       └── ...
└── patches/
    ├── [patch-id-1]/
    │   ├── season: number
    │   ├── majorVersion: number
    │   ├── minorVersion: number
    │   └── changes: array
    └── [patch-id-2]/
        └── ...
```

### Local Storage

For local storage, you could use a similar structure with IndexedDB or LocalStorage, serializing the data as JSON.

## State Management Integration

### Local-only Solution (e.g., using Redux)

Here's an example of how you might structure your Redux store:

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { KPILibrary } from 'kaizen-pis-library';

const library = new KPILibrary();

const kpiSlice = createSlice({
  name: 'kpis',
  initialState: [],
  reducers: {
    addKPI: (state, action) => {
      const kpi = library.createKPI(action.payload);
      state.push(kpi);
    },
    // ... other reducers
  },
});

const logSlice = createSlice({
  name: 'logs',
  initialState: [],
  reducers: {
    addLog: (state, action) => {
      const log = library.createLog(action.payload);
      state.push(log);
    },
    // ... other reducers
  },
});

const store = configureStore({
  reducer: {
    kpis: kpiSlice.reducer,
    logs: logSlice.reducer,
  },
});
```

### Cloud-only Solution (e.g., using Firebase)

Here's an example using Firebase:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { KPILibrary } from 'kaizen-pis-library';

const firebaseConfig = {
  // Your Firebase configuration
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const library = new KPILibrary();

async function addKPI(kpiData) {
  const kpi = library.createKPI(kpiData);
  await addDoc(collection(db, 'kpis'), kpi);
}

async function getKPI(id) {
  const docRef = doc(db, 'kpis', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

// Similar functions for logs and patches
```

### Local with Cloud Sync Solution

This approach combines local state management with periodic syncing to the cloud:

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { KPILibrary } from 'kaizen-pis-library';

// ... Firebase setup as in the cloud-only example

const library = new KPILibrary();

const kpiSlice = createSlice({
  name: 'kpis',
  initialState: [],
  reducers: {
    addKPI: (state, action) => {
      const kpi = library.createKPI(action.payload);
      state.push(kpi);
    },
    setKPIs: (state, action) => {
      return action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    kpis: kpiSlice.reducer,
  },
});

// Sync function
async function syncWithCloud() {
  // Push local changes to cloud
  store.getState().kpis.forEach(async (kpi) => {
    await addDoc(collection(db, 'kpis'), kpi);
  });

  // Pull changes from cloud
  const querySnapshot = await getDocs(collection(db, 'kpis'));
  const cloudKPIs = querySnapshot.docs.map(doc => doc.data());
  store.dispatch(kpiSlice.actions.setKPIs(cloudKPIs));
}

// Call syncWithCloud periodically or on specific events
```

Remember, these are simplified examples and should be adapted to your specific needs and error handling requirements.