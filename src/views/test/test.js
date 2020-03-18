import React, { useState, useContext } from 'react'
import QrReader from 'react-qr-reader'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Card, CardContent } from '@material-ui/core';
import { MyAppContext } from '../../context';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing(3),
    alignItems: 'center'
  },
  content: {
    marginTop: theme.spacing(2)
  },
  result: {
    flex: 0.1,
    justifyContent: 'flex-end',
    paddingLeft: 50,
    paddingRight: 50,
  },
  cameraDisplay: {
    // flex: 1,
    // justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  clearbutton: {
    alignItems: 'center',
    width: '100%'
  }
}));

const Test = () =>  {
  const classes = useStyles();
  const [result, setResult] = useState('No result');

  const {value, setValue} = useContext(MyAppContext);

  const handleScan = data => {
    if (data) {
      setResult(data);
      setValue(data);
    }
  }

  const handleError = err => {
    console.error(err)
  }

  const clearResult = () => {
    setResult('No result');
  }

  return (
      <div className={classes.root}>

        <Grid container direction='row' justify='center' alignItems='center' spacing={2}>

          <Grid item xs={6}>
            <QrReader
            delay={1}
            onError={handleError}
            onScan={handleScan}
            showViewFinder={true}
            legacyMode={false}
            className={classes.cameraDisplay}/>
          </Grid>

          <Grid item container spacing={2} alignItems='stretch' justify='center' direction='column' xs={6}>
            
            <Grid item xs={12}>
              <Card variant='outlined' className={classes.resultcard}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {result}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button  variant="contained" color="primary" onClick={clearResult} className={classes.clearbutton}>
                Clear
              </Button>
            </Grid>

          </Grid>


          
          
        </Grid>

      </div>
  )

}

export default Test;