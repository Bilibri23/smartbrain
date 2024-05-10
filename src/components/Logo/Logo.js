import React from 'react';
import Tilt from 'react-parallax-tilt'
import './Logo.css'
import brain from './brain.png'

const Logo =()=>{
	return(
			<div className = 'ma2 mt10'>
			<Tilt className ="Tilt br2 shadow-2"  options={{max:30}} style={{ height: 100, width: 100 }}>
      			<div className = "Tilt-inner ">
        			 <img style = {{paddingTop: '1px'}} alt ="logo" src = {brain}/>
      			</div>
    		</Tilt>
				
			</div>
		);
}

export default Logo;