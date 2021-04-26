import React, { useEffect, useState} from 'react';

const App2 = () => {
  const [count, setCount]= useState(0);
  //const data = Fetch("/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json");

  return(
    <div>
      <div> count: {count} </div>
      <button onClick={()=> setCount(count + 1)}> INCREMENT </button>
    </div>
  );
};

export default App2;