import React, { useState, useEffect } from 'react';

import FusionInput from './form/FusionForm';
import FusionTable from './table/FusionTable';

import './App.css';
import { FusionFilters } from '../data/data';


const App: React.FC = () => {
  const [ currentMon, setCurrentMon ] = useState<string | undefined>(undefined);
  const [ filters, setFilters ] = useState<FusionFilters>({
    customArtOnly: false,
    typeOverride: new Map<string, boolean>(),
    fullyEvolvedOnly: false,
  });

  useEffect(() => {
    console.log("the new pokemon is " + currentMon);
  }, [currentMon]);

  return (
    <>
      <FusionInput
        currentMon={currentMon}
        setCurrentMon={setCurrentMon}
        filters={filters}
        setFilters={setFilters}
      />

      <FusionTable
        currentMon={currentMon}
        filters={filters}
      />
    </>
  );
}

export default App;