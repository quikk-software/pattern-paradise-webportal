import React from 'react';
import AboutPageComponent from '@/components/about-page';
import { NavbarComponent } from '@/components/navbar';

export default function AboutPage() {
  return (
    <div>
      <NavbarComponent background="none" />
      <AboutPageComponent />
    </div>
  );
}
