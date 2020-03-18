import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Button } from '@material-ui/core';

const Test = () =>  {
  const [result, setResult] = useState('No result');

  const handleScan = data => {
    if (data) {
      setResult(data);
    }
  }

  const handleError = err => {
    console.error(err)
  }

  return (
      <div style={{display: 'flex'}}>
      <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '25%', height: '25%' }}
      />
      <p style={{justifyContent:'flex-end'}}>{result}</p>
      </div>
  )

}

export default Test;