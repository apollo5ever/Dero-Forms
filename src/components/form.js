import React from 'react'
import ReactDOM from 'react-dom'
import { LoginContext } from '../LoginContext';
import {useParams,useSearchParams} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';





export default function Form(){



const [searchParams,setSearchParams] = useSearchParams()
const [state,setState] = React.useContext(LoginContext)
const params = useParams()
const cid = params.cid
const [form,setForm] = React.useState(null)

React.useEffect(()=>{
  getForm()
  
},[state.ipfs])

const getForm = async ()=>{
  for await (const buf of state.ipfs.cat(cid.toString())){
    let form = JSON.parse(buf.toString())
    console.log(form)
    setForm(form)
  }
}
  



 const handleSubmit = async e => {
    e.preventDefault()

    const deroBridgeApi = state.deroBridgeApiRef.current

  


    const post = {
      address: state.userAddress,
      title:form.title,
      responses:[]
  }

  for(var i=0; i<form.questions.length;i++){
    console.log(e.target[`question_${i}`].value)
    post.responses.push(new Object({question:form.questions[i].question,response:e.target[`question_${i}`].value}))
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



   
    
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {

       "ringsize": 2,
      "transfers":[
        {
          "destination":form.address,
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
        {form&&form.title}
        
    
    <form onSubmit={handleSubmit}>
      {form&&form.questions.map((x,i)=><><p>{x.question}</p>{x.type=="multi"?<select id={`question_${i}`}><option value="a">{x.option_a}</option><option value="b">{x.option_b}</option><option value="c">{x.option_c}</option><option value="d">{x.option_d}</option></select>
      :x.type=="long"?<textarea rows="12" cols="40" id={`question_${i}`}/>
      :<input type="text" id={`question_${i}`}/>}</>)}
     

      <button type={"submit"}>Submit</button>
    </form>

    </div>
    }

        </div>
    )
}