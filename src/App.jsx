import { useState } from 'react'
import ProductSections from './components/ProductSections';
function App() {
  const [selectedTitleId, setSelectedTitleId] = useState(null);

  return (
    <ProductSections />
  );
}

export default App
