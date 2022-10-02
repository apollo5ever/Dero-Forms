import React from 'react'
import ReactDOM from 'react-dom'
import { LoginContext } from '../LoginContext';
import {useParams,useSearchParams} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';





export default function PublishPost(){



const [searchParams,setSearchParams] = useSearchParams()
const [state,setState] = React.useContext(LoginContext)

  



 const handleSubmit = async e => {
    e.preventDefault()

    const deroBridgeApi = state.deroBridgeApiRef.current

  


    const post = {
      discord:e.target.discord.value,
      pexp:e.target.pexp.value,
      english:e.target.english.value,
      rexp:e.target.rexp.value,
      dexp:e.target.dexp.value,
      hope:e.target.hope.value
  }
  const key = CryptoJS.lib.WordArray.random(32).toString()
  console.log(key)

  const encryptedPost = CryptoJS.AES.encrypt(JSON.stringify(post),key).toString()
console.log(encryptedPost)
    var postData = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 0
      },
      "pinataMetadata": {
        "name": "response",
        "keyvalues": {
        }
      },
      "pinataContent": encryptedPost
    });

    const islandPinata = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
     },
      
            body:  postData
    });

    
    const addPost= await state.ipfs.add(JSON.stringify(encryptedPost).toString())
    const M =addPost.cid.toString()


/*
    let supporterList = Object.keys(scData)
    .filter(key=>supporterSearch.test(key))
    .filter(key=>scData[key]> new Date().getTime()/1000)
    .map(x=>new Object({
      "destination":x.substring(0,66),
      "amount":1,
      "payload_rpc":[{
              "name": "key",
              "datatype": "S",
              "value": key
      },
      {
        "name":"cid",
        "datatype":"S",
        "value":M
      }
]
      }))
*/
     // console.log(supporterList,new Date().getTime()*1000)


   
    
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {

       "ringsize": 2,
      "transfers":[
        {
          "destination":"apollo",
          "amount":1,
          "payload_rpc":[{
                  "name": "key",
                  "datatype": "S",
                  "value": key
          },
          {
            "name":"cid",
            "datatype":"S",
            "value":M
          }
    ]
          }
      ],
      
      
     
   
  }))
 
   
    
setSearchParams({"status":"success"})
};



  

 
  

    return(
        <div className="function">
   {searchParams.get("status")=="success"?"Success!":   <div>
        <h1>Dero Forms</h1>
    
    <form onSubmit={handleSubmit}>
      
        <input placeholder="your discord username" id="discord" type="text"/>
        <p>How much experience do you have with programming generally?</p>
        <select id="pexp"><option value="0">Utter Noob</option><option value="1">Some</option><option value="2">A Lot</option><option value="3">Veteran</option></select>
        <p>Is English your first language?</p>
        <select id="english"><option value="0">No</option><option value="1">Yes</option></select>
        <p>How much experience do you have with JS React?</p>
        <select id="rexp"><option value="0">Utter Noob</option><option value="1">Some</option><option value="2">A Lot</option><option value="3">Veteran</option></select>
        <p>How much experience do you have with Dero generally?</p>
        <select id="dexp"><option value="0">Utter Noob</option><option value="1">Some</option><option value="2">A Lot</option><option value="3">Veteran</option></select>

    <textarea placeholder="What are you hoping to get out of this course?" rows="44" cols="80" id="hope">
</textarea>

      <button type={"submit"}>Submit</button>
    </form>

    </div>
    }

        </div>
    )
}