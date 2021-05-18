import React from 'react'

const dateToday = new Date();

export default () => (
  <footer className='Footer-footer'>
    © YesItsAnanias.com, {dateToday.getFullYear()}
  </footer>
)
