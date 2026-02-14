import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export type CustomFieldType = 'materials' | 'rooms' | 'shapes';

export async function getCustomValues(
  field: CustomFieldType
): Promise<string[]> {
  try {
    const docRef = doc(db, 'settings', 'customValues');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[field] || [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function addCustomValue(
  field: CustomFieldType,
  value: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'customValues');
    const docSnap = await getDoc(docRef);

    const currentValues = docSnap.exists() ? docSnap.data()[field] || [] : [];

    // Avoid duplicates
    if (!currentValues.includes(value)) {
      const updatedValues = [...currentValues, value];

      if (docSnap.exists()) {
        await updateDoc(docRef, { [field]: updatedValues });
      } else {
        await setDoc(docRef, { [field]: updatedValues });
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
