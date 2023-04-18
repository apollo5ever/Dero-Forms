import React from 'react'
import './App.css';
import {Outlet,NavLink,Link} from 'react-router-dom'
import * as IPFS from 'ipfs-core'
import DeroBridgeApi from 'dero-rpc-bridge-api'
import {LoginContext} from './LoginContext'
//import {create} from 'ipfs-http-client'


import to from 'await-to-js'

import PublishPost from './components/publishPost';
import CreateForm from './components/createForm';



function App() {
  
 
  const [ipfs,setipfs] = React.useState(null)


  const deroBridgeApiRef = React.useRef()
  const [state, setState] = React.useContext(LoginContext);
  const [bridgeInitText, setBridgeInitText] = React.useState(<a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">Not connected to extension. Download here.</a>)
  const [cocoBalance,setCocoBalance] = React.useState(0)

  const logstate=() =>{
    console.log("state",state)
  }

  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


  const getSCID = React.useCallback(async () => {
      
    const deroBridgeApi = deroBridgeApiRef.current
    
  
    const ipfsboy = await IPFS.create()
   
    const validIp4 = '/ip4/64.225.105.42/tcp/4001/p2p/QmPo1ygpngghu5it8u4Mr3ym6SEU2Wp2wA66Z91Y1S1g29'

    const rez = await ipfsboy.bootstrap.add(validIp4)
    console.log(rez.Peers)
    const config = await ipfsboy.config.getAll()
    setState(state=>({...state,ipfs:ipfsboy}))
  })
 

 /* const meta= async()=>{
    console.log("meta")
    const node = await IPFS.create({repo: 'ok'+ Math.random()})
    const {cid} = await node.add(JSON.stringify(testJ).toString())
    console.info(cid.toString())
  /*
    await state.ipfs.start()
    const v = await state.ipfs.version()
    console.log(v)
    const { cid } = await state.ipfs.add(JSON.stringify(testJ).toString())
console.info(cid.toString())

  }
  */

  const stop= async()=>{
    console.log("stop")
   await state.ipfs.stop()
   
    const v = await state.ipfs.version()
    console.log(v)
   
  }

  





  React.useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        setBridgeInitText(<a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd" target="_blank" rel="noopener noreferrer">Not connected to extension. Download here.</a>)
      } else {
        setBridgeInitText('rpc-bridge connected')
        setState(state=>({...state,deroBridgeApiRef:deroBridgeApiRef}))
        getAddress();
        getSCID();
       
        
        
      }
    }

    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])

  const getAddress = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    

    const [err0, res0] = await to(deroBridgeApi.wallet('get-address', {
     
   }))

 
   
   console.log("get-address-error",err0)
   console.log(res0)
   if(err0 == null){
    setState(state=>({...state,userAddress:res0.data.result.address}))
    
   }
    })







  return (
    
    <div className="App">
      
    
<div className="navbar"><NavLink to={`/createForm`}>Create Form</NavLink><NavLink to={`/responses`}>View Responses</NavLink></div>

     <Outlet />


    </div>
    
  );
}

export default App;
