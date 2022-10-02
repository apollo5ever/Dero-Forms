import React from 'react'
import './App.css';
import {Outlet,NavLink,Link} from 'react-router-dom'
import * as IPFS from 'ipfs-core'
import DeroBridgeApi from 'dero-rpc-bridge-api'
import {LoginContext} from './LoginContext'
//import {create} from 'ipfs-http-client'


import to from 'await-to-js'

import PublishPost from './components/publishPost';



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

  const getSCID2 = async ()=>{
    setState(state=>({...state,scid:"99a8c70cfae03541a4c0e85854c23a83f0aa78727a1f921d55960cc90c9df1b5",coco:"bf80416cdb679ea49a2f27efe23b6d77eb70ece51e07fcaf3bce1a11413cec99"}))
    const ipfsboy = await IPFS.create()
       const validIp4 = '/ip4/64.225.105.42/tcp/4001/p2p/QmPo1ygpngghu5it8u4Mr3ym6SEU2Wp2wA66Z91Y1S1g29'
    const rez = await ipfsboy.bootstrap.add(validIp4)
    const config = await ipfsboy.config.getAll()
    setState(state=>({...state,ipfs:ipfsboy}))
      }
  
  const getSCID = React.useCallback(async () => {
      
    const deroBridgeApi = deroBridgeApiRef.current
    const [err,res] = await to(deroBridgeApi.daemon('get-sc',{
      "scid": "0000000000000000000000000000000000000000000000000000000000000001",
      "keysstring":["keystore"]
    }))
    let keystore_scid= "80"+res.data.result.valuesstring[0].substring(2,64)
    const [err2,res2] = await to(deroBridgeApi.daemon('get-sc',{
      "scid": keystore_scid,
      "keysstring":["k:private.islands.scid","k:private.islands.coco"]
    }))
    let scid = res2.data.result.valuesstring[0]
    let coco = res2.data.result.valuesstring[1]
    setState(state=>({...state,scid:scid,coco:coco}))
  
    const ipfsboy = await IPFS.create()
   
    const validIp4 = '/ip4/64.225.105.42/tcp/4001/p2p/QmPo1ygpngghu5it8u4Mr3ym6SEU2Wp2wA66Z91Y1S1g29'

    const rez = await ipfsboy.bootstrap.add(validIp4)
    console.log(rez.Peers)
    const config = await ipfsboy.config.getAll()
    setState(state=>({...state,ipfs:ipfsboy}))
  })
 
  const getIslands = React.useCallback(async () => {
    console.log("GET ISLANDS")
    const deroBridgeApi = state.deroBridgeApiRef.current


  const [err,res] = await to(deroBridgeApi.daemon('get-sc',{
    "scid": state.scid,
    "variables":true
  }))
  

  var search= new RegExp(`.*_O`)  
  console.log("search",search)
  var scData = res.data.result.stringkeys //.map(x=>x.match(search))
console.log(scData)
var myIslands=[]

const myList=Object.keys(scData)
  .filter(key => search.test(key))
  .filter(key=>hex2a(scData[key])==state.userAddress)
  .map(key=>new Object({name:key.substring(0,key.length-2),meta:hex2a(scData[`${key.substring(0,key.length-2)}_M`]),j:scData[`${key.substring(0,key.length-2)}_j`]}))
   console.log("MY LIST",myList)
  for(var i=0; i<myList.length;i++){
    let k = myList[i].meta
    let j=myList[i].j
     for await (const buf of state.ipfs.cat(k)){
      let m = await JSON.parse(buf.toString())
      m.j=j
    myIslands.push(m)
    
  }
}


 
  setState(state=>({...state,myIslands:myIslands,active:0}))

  
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

  

React.useEffect(()=>{
  getIslands();
},[state.deroBridgeApiRef,state.ipfs,state.userAddress])



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
        getRandom();
        
        
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

    const getRandom = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      
  
      const [err0, res0] = await to(deroBridgeApi.daemon('get-random-address', {
       
     }))
  
   
     
     console.log("get-random-address-error",err0)
     console.log(res0)
     if(err0 == null){
     setState(state=>({...state,randomAddress:res0.data.result.address[0]}))
      
     }
      })

    const getCocoBalance = React.useCallback(async () => {
      
      const deroBridgeApi = deroBridgeApiRef.current
      const [err,res] = await to(deroBridgeApi.wallet('get-balance',{
        "scid": state.coco
      }))
      console.log("balance:", res.data.result.balance)
      setState(state=>({...state,cocoBalance:res.data.result.balance}))
    })

React.useEffect(()=>{
  getCocoBalance();
},[state.scid,state.userAddress])


  return (
    
    <div className="App">
      
    
<PublishPost/>

     <Outlet />


    </div>
    
  );
}

export default App;
