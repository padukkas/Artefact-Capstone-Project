import {useState} from 'react';
import axios from 'axios';

import './App.css';


function App() {
  const [userOneInput, setUserOneInput] = useState('');
  const [userTwoInput, setUserTwoInput] = useState('');
  const [userOneText, setUserOneText] = useState([]);
  const [userTwoText, setUserTwoText] = useState([]);
  const [userOneAIResults, setUserOneAIResults] = useState({negative: -1, neutral: -1, positive: -1})
  const [userTwoIResults, setUserTwoAIResults] = useState({negative: -1, neutral: -1, positive: -1})
 
  async function process(text) {
    const response = await axios.post('http://127.0.0.1:3005/process/', {text: text}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });

    return response.data;
  }
  
  async function processText() {
    if (userOneInput) {
      const response = await process(userOneInput);

      // Set raw message
      setUserOneText([...userOneText, {user: 'User One', message: userOneInput}]);
      // Set processed message
      setUserTwoText([...userTwoText, {user: 'User One', message: response.message}]);
      setUserOneInput('');
      setUserOneAIResults(response.emotions);
    }
    if (userTwoInput) {
      const response = await process(userTwoInput);
      // Set raw message
      setUserTwoText([...userTwoText, {user: 'User Two', message: userTwoInput}]);
      // Set processed message
      setUserOneText([...userOneText, {user: 'User Two', message: response.message}]);
      setUserTwoInput('');
      setUserTwoAIResults(response.emotions);
    }
  }

  return (
    <div className='grid grid-cols-12 border border-black rounded-2xl h-screen'>
      <div className='col-span-5 border border-black m-16 rounded-2xl text-center'>
        <h1 className='text-2xl mt-16 border border-black p-6 mx-4 rounded-full'>User One</h1>

        <div className='mt-12 border border-black rounded-2xl p-6 mx-4 text-left'>
          {userOneText.length !== 0 && userOneText.map((text) => (
            <p key={text.message} className='text-lg mb-1 rounded-lg'><span className='font-bold'>{text.user}: </span>{text.message}</p>
          ))}
        </div>

        User Input:
        <input className='mt-12 w-3/4 border border-black rounded-2xl p-6 mx-4' value={userOneInput} onChange={(e) => setUserOneInput(e.target.value)}
          placeholder="Enter text here"/>

        {userOneAIResults.negative === -1 ? <p></p> :(
        <>
          <p className='text-xl mt-12'>Latest user input AI rating:</p>
          <div>
            <p className='text-red-500'>Negative: {(userOneAIResults.negative * 100).toFixed(2)}%</p>
            <p className='text-yellow-500'>Neutral: {(userOneAIResults.neutral * 100).toFixed(2)}%</p>
            <p className='text-green-500'>Positive: {(userOneAIResults.positive * 100).toFixed(2)}%</p>
          </div>
          </>
        )}
      </div>
      <div className='col-span-2 flex items-center justify-center'>
        <button className='bg-blue-500 text-white p-5 rounded-xl text-lg font-bold' onClick={processText}>Process</button>
      </div>
      <div className='col-span-5 border border-black m-16 rounded-2xl text-center'>
        <h1 className='text-2xl mt-16 border border-black p-6 mx-4 rounded-full'>User Two</h1>

        <div className='mt-12 border border-black rounded-2xl p-6 mx-4 text-left'>
          {userTwoText.length !== 0 && userTwoText.map((text) => (
            <p key={text.message} className='text-lg mb-1 rounded-lg'><span className='font-bold'>{text.user}: </span>{text.message}</p>
          ))}
        </div>

        User Input:
        <input className='mt-12 w-3/4 border border-black rounded-2xl p-6 mx-4' value={userTwoInput} onChange={(e) => {setUserTwoInput(e.target.value)}}
          placeholder="Enter text here"/>

        {userTwoIResults.negative === -1 ? <p></p> :(
        <>
          <p className='text-xl mt-12'>Latest user input AI rating:</p>
          <div>
            <p className='text-red-500'>Negative: {(userTwoIResults.negative * 100).toFixed(2)}%</p>
            <p className='text-yellow-500'>Neutral: {(userTwoIResults.neutral * 100).toFixed(2)}%</p>
            <p className='text-green-500'>Positive: {(userTwoIResults.positive * 100).toFixed(2)}%</p>
          </div>
          </>
        )}
      </div>

    </div>
  );
}

export default App;