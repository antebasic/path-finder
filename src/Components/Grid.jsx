import React, { useEffect, useState, useLayoutEffect } from 'react'
import Node from './Node';
import '../Style/Grid.css'
import start from "../Images/start.svg"
import end from "../Images/end.svg"
import '../Style/Header.css'
import { IconButton } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import DeleteIcon from '@mui/icons-material/Delete';

function Grid() {

    const [grid, setGrid] = useState([])
    const [drawWall, setDrawWall] = useState(false)
    const [currentIcon, setCurrentIcon] = useState(null)
    const [windowSize, setWindowSize] = useState([0, 0])
    const [coords, setCoords] = useState([0, 0])
    const [occupied, setOccupied] = useState(false)



    const useWindowSize = () => {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
          const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
          };
          window.addEventListener("resize", updateSize);
          updateSize();
          return () => window.removeEventListener("resize", updateSize);
        }, []);
        return size;
      };
    

useEffect(() => {
    let temp = []
    let i = 0
    setWindowSize([Math.floor(window.innerHeight * 0.8 / 50), Math.floor(window.innerWidth * 0.9 / 50)])
    for (let row = 0; row < Math.floor(window.innerHeight * 0.8 / 50); row++)
        for (let col = 0; col < Math.floor(window.innerWidth * 0.9 / 50); col++){
            temp.push({
                id: i,
                position: [col, row],
                icon: null,
                parent: null,
                f: 0,
                g: 0,
                h: 0,
                isWall: false,
                visited: false,
            })
            i += 1 

        }
    temp[0].icon = start
    temp[temp.length-1].icon = end

    setCoords([0,temp.length-1])
    setGrid(temp)
  }, [useWindowSize()]);

 const handleMouseEnter = (id) => {
        let node = document.getElementById(id)
        let image = node.style.backgroundImage
        if (drawWall && !image){
            let node = document.getElementById(id)
            node.style.backgroundColor = node.style.backgroundColor === "black" ? "white" : "black"
            grid[id].isWall ^= true
        }
        else if (currentIcon){
            node.style.backgroundImage = currentIcon
        }
  }

const handleMouseLeave = (id) => {
    let node = document.getElementById(id)
    if (currentIcon){
        node.style.backgroundImage = null
    }
}
  
const handleMouseDown = (id) => {
    let node = document.getElementById(id)
    let image = node.style.backgroundImage
    if (image){
        node.style.backgroundImage = null
        setCurrentIcon(image)
    }
    else {
        node.style.backgroundColor = node.style.backgroundColor === "black" ? "white" : "black"
        grid[id].isWall ^= true
        setDrawWall(true)
    }
}

const handleMouseUp = (id) => {
    let node = document.getElementById(id)
    if (currentIcon){
        node.style.backgroundImage = currentIcon
        node.style.backgroundColor = "white"
        setCurrentIcon(null)
        currentIcon.includes("start") ? setCoords([id , coords[1]]) : setCoords([coords[0], id])
        
    }
    else setDrawWall(false)

}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const colorNode = (node, color) => {
    node.style.backgroundColor = color
}

const aStar = async (start, end) => {
    let startNode = grid[start]
    let endNode = grid[end]

    let openList = []
    let closedList = []

    openList.push(startNode)


    while (openList.length !== 0) {
        await sleep(20)
        // Get current node

        let currentNode = openList[0]
        let currentIndex = 0
        for (const [index, item] of openList.entries()){
            if (item.f < currentNode.f) {
                currentNode = item
                currentIndex = index
            }
        }

        document.getElementById(currentNode.id).style.backgroundColor = "#3D5A80"


        openList.splice(currentIndex, 1)
        closedList.push(currentNode)

        // Found the goal

        if (currentNode.id === endNode.id){
            let path = []
            let current = currentNode
            while (current != null){
                path.push(current.id)
                current = current.parent
            }
            return path.reverse()
        }

        let children = []
        for (const newPosition of [[0, -1], [0, 1], [-1, 0], [1, 0]]){
            var nodePosition = [currentNode.position[0] + newPosition[0], currentNode.position[1] + newPosition[1]]
        
            if (nodePosition[0] >= windowSize[1] || nodePosition[0] < 0 || nodePosition[1] >= windowSize[0] || nodePosition[1] < 0) continue
            
            let newNodeId = nodePosition[1] * windowSize[1] + nodePosition[0]
            let newNode = {...grid[newNodeId]}

            if (newNode.isWall) continue            
            
            newNode.parent = currentNode

            children.push(newNode)

        }

        for (let child of children){
            let flag = false
            for (let closedChild of closedList){
                if (child.id === closedChild.id) flag = true
            }

            if (flag) continue;
    
            child.g = currentNode.g + 1
            child.h = ((child.position[0] - endNode.position[0]) ** 2) + ((child.position[1] - endNode.position[1]) ** 2)
            child.f = child.g + child.h

            for (let openNode of openList){
                if (child.id === openNode.id && child.g > openNode.g) {
                    flag = true
                    break
                }

            }

            if (flag) continue;

            openList.push(child)
            child.visited = true

            if (!child.isWall || !child.visited){
                document.getElementById(child.id).style.backgroundColor = "#fca311"
            }

        }
    }

}

const reset = () => {
    for (let curr of grid){
        let node = document.getElementById(curr.id)
        if(!curr.isWall){
            node.style.backgroundColor = "white"
            curr.isWall = false
        }
        
    }
}

const resetAll = async () => {
    for (let curr of grid){
        let node = document.getElementById(curr.id)
        node.style.backgroundColor = "white"
        curr.isWall = false
    }
}

  return (
    <>
    <div className="container">
      <div className='header'>Path finder</div>
      <div className="play">
        <div className="help">
          <h3>Start</h3>
        </div>
        <IconButton color="secondary" onClick={async () => {
            if (occupied) reset()
            setOccupied(true)
            let path = await aStar(coords[0], coords[1])
            for (let curr of path){
                document.getElementById(curr).style.backgroundColor = "#2b9348"
                await sleep(20)
            }
            }}>
          <PlayCircleFilledWhiteIcon sx={{ fontSize: windowSize[0] * 5, color: "#14213D" }}/>
        </IconButton>
        <IconButton color="secondary" onClick={async () => {
            await resetAll()
        }}>
            <DeleteIcon sx={{ fontSize: windowSize[0] * 5, color: "#14213D" }}/>
        </IconButton>
        <h3>Clear </h3>

        </div>

    </div>
    <div className="grid" onMouseMoveCapture={(e)=> e.preventDefault()}>
        {
            grid.map((i) => {
                return(
                    <Node 
                        key={i.id} 
                        id={i.id}
                        icon={i.icon}
                        onMouseEnter={(id) =>handleMouseEnter(id)}
                        onMouseDown={(id) =>handleMouseDown(id)}
                        onMouseUp={(id) =>handleMouseUp(id)}
                        onMouseLeave={(id) =>handleMouseLeave(id)}
                    >
                    </Node>
                )
            })
        }

        
    </div>
    </>
  )
}

export default Grid