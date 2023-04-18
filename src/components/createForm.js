import React from 'react'
import ReactDOM from 'react-dom'
import { LoginContext } from '../LoginContext';
import {useParams,useSearchParams,NavLink} from 'react-router-dom'
import CryptoJS, { x64 } from 'crypto-js';
import to from 'await-to-js';





export default function CreateForm(){



const [searchParams,setSearchParams] = useSearchParams()
const [state,setState] = React.useContext(LoginContext)
//const [surveyLength,setSurveyLength] = React.useState(1)
const [qArray, setQArray] = React.useState([
  <div>
    <input type="text" placeholder="Question 1" id={`question_${0}`} />
    <select
      id={`question_${0}_type`}
      onChange={(e) => handleQuestionTypeChange(e, 0)}
    >
      <option value="short">Short Answer</option>
      <option value="long">Long Answer</option>
      <option value="multi">Multiple Choice</option>
    </select>
  </div>,
]);
const [cid,setCid] = React.useState(null)


const handleQuestionTypeChange = (e, index) => {
  const newQArray = [...qArray];

  // Get the selected question type
  const questionType = e.target.value;

  if (questionType === "multi") {
    // If the selected question type is "multiple choice", add 4 new input fields
    const newInputs = [];
    for (let i = 1; i <= 4; i++) {
      newInputs.push(
        <input
          type="text"
          placeholder={`Option ${i}`}
          id={`question_${index}_option_${i}`}
        />
      );
    }
    newQArray[index] = (
      <div>
        <input
          type="text"
          placeholder={`Question ${index + 1}`}
          id={`question_${index}`}
        />
        <select
          id={`question_${index}_type`}
          onChange={(e) => handleQuestionTypeChange(e, index)}
        >
          <option value="short">Short Answer</option>
          <option value="long">Long Answer</option>
          <option value="multi">Multiple Choice</option>
        </select>
        {newInputs}
      </div>
    );
  } else {
    // If the selected question type is not "multiple choice", remove any additional input fields
    newQArray[index] = (
      <div>
        <input
          type="text"
          placeholder={`Question ${index + 1}`}
          id={`question_${index}`}
        />
        <select
          id={`question_${index}_type`}
          onChange={(e) => handleQuestionTypeChange(e, index)}
        >
          <option value="short">Short Answer</option>
          <option value="long">Long Answer</option>
          <option value="multi">Multiple Choice</option>
        </select>
      </div>
    );
  }

  setQArray(newQArray);
}; 
  

const newSubmit = async e =>{
  e.preventDefault()
  

  var form = {title:e.target.title.value, address: state.userAddress, questions:[]}

  for(var i=0; i<qArray.length;i++){
    console.log(e.target[`question_${i}`].value)
    if(e.target[`question_${i}_type`].value=="multi"){
      form.questions.push(new Object({question:e.target[`question_${i}`].value,type:e.target[`question_${i}_type`].value,option_a:e.target[`question_${i}_option_1`].value,option_b:e.target[`question_${i}_option_2`].value,option_c:e.target[`question_${i}_option_3`].value,option_d:e.target[`question_${i}_option_4`].value}))
    }else{
      form.questions.push(new Object({question:e.target[`question_${i}`].value,type:e.target[`question_${i}_type`].value}))
    }
    
  }

  console.log(form)

  var postData = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 0
    },
    "pinataMetadata": {
      "name": "response",
      "keyvalues": {
      }
    },
    "pinataContent": form
  });

  const formPinata = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json','authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNjc5NzU5MS02OGUxLTQyNzAtYjZhMy01NjBjN2Y3M2IwYTMiLCJlbWFpbCI6ImJhY2tlbmRAYW1icm9zaWEubW9uZXkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDgzZTJkMGQ2Yzg2YTBhNjlkY2YiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2VlMTE4MWM2YTBlN2FmNjQ0YmUzZmEyYmU1ZWY5ZWFmMmNmMmYyYzc0NWQzZGIxNDdiMThhOTU5NWMwZDNlIiwiaWF0IjoxNjYxMTk1NjUxfQ.9Pz2W_h7zCiYyuRuVySKcDwA2fl_Jbm6QDulihAIpmo`
   },
    
          body:  postData
  });

  const addPost= await state.ipfs.add(JSON.stringify(form).toString())
  const M =addPost.cid.toString()
 setCid(M)
  setSearchParams({"status":"success"})
}





  

 
  

    return(
        <div className="function">
   {searchParams.get("status")=="success"?<>Success! Here's the <NavLink to={`/${cid}`}>link to your form</NavLink></>:   <div>
        <h1>Dero Forms</h1>
    
    <form onSubmit={newSubmit}>
      
        <input placeholder="form title" id="title" type="text"/>
        {qArray}<div className="add" onClick={()=>setQArray([...qArray,<div>
            <input
              type="text"
              placeholder={`Question ${qArray.length + 1}`}
              id={`question_${qArray.length}`}
            />
            <select
              id={`question_${qArray.length}_type`}
              onChange={(e) => handleQuestionTypeChange(e, qArray.length)}
            >
              <option value="short">Short Answer</option>
              <option value="long">Long Answer</option>
              <option value="multi">Multiple Choice</option>
            </select>
          </div>])}>+</div>

      <button type={"submit"}>Submit</button>
    </form>

    </div>
    }

        </div>
    )
}