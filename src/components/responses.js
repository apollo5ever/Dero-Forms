import React from 'react'
import ReactDOM from 'react-dom'
import { LoginContext } from '../LoginContext';
import {useParams,useSearchParams} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';





export default function Responses(){



const [searchParams,setSearchParams] = useSearchParams()
const [state,setState] = React.useContext(LoginContext)

const [response,setResponse] = React.useState(null)



function hex2a(hex){
  var str = '';
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;

  
}



 const handleSubmit = async e => {
    e.preventDefault()
    console.log("get response")
    console.log(state.ipfs)
    console.log(e.target.cid.value)
    
  let encryptedResponse
    for await (const buf of state.ipfs.cat(e.target.cid.value.toString())){
      console.log("awaiting buf")
      encryptedResponse = buf.toString()
      console.log(encryptedResponse)
    }
    let decryptedResponse=CryptoJS.AES.decrypt(encryptedResponse.substring(1,encryptedResponse.length-1),e.target.key.value).toString()
    let response = JSON.parse(hex2a(decryptedResponse))
    console.log(response)
 setResponse(response)
    
   
    

 
   

};



  

 
  

    return(
        <div className="function">
   <div>
        <h1>Dero Forms</h1>
        
        
    
    <form onSubmit={handleSubmit}>
      <input type="text" id="cid" placeholder="cid"/>
      <input type="text" id="key" placeholder="key"/>
     

      <button type={"submit"}>Submit</button>
    </form>
    <h3>{response && response.title}</h3>
    <p><b>Responder: </b>{response && response.address}</p>
    {response && response.responses.map(x=><p><b>{x.question}:</b>{x.response}</p>)}

    </div>
    

        </div>
    )
}