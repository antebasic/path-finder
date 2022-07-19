import React from 'react'
import '../Style/Node.css'

function Node({ id, icon, onMouseEnter, onMouseDown, onMouseUp, onMouseLeave }) {
  
  return (
    <div 
        className="node" 
        id={id}
        style={{backgroundImage: icon && `url(${icon})`, backgroundRepeat: "no-repeat", backgroundPosition: "center"}}
        onMouseEnter={() => {onMouseEnter(id)}}
        onMouseLeave={() => {onMouseLeave(id)}}
        onMouseDown={() => {onMouseDown(id)}}
        onMouseUp={() => {onMouseUp(id)}}></div>
  )
}

export default Node