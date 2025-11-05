// app/index.tsx
import { Redirect } from 'expo-router';
import React from 'react';
//import register from './Register';
export default function Index() {
  return <Redirect href="/Register" />;
}
