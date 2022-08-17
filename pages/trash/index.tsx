import { Alert } from '@mui/material'
import type { NextPage } from 'next'
import { createData, Drive } from '../../components/Drive/Drive'

const Trash: NextPage = () => {
  const data = [
  ];

  return (
    <>
      <Alert severity="warning">We will stop pinning your files, but as long as nodes retain copies of the data they will be available!</Alert>
    </>
  )
}

export default Trash

