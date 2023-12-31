import { useState, useEffect } from 'react';

import  {Pen} from './icons/pen.js';
export default function UserCHatItem({ onClick, name, lastMessage, avatar, did, web5 }) {

  const [messages, setmessages] = useState([]);
  const [editMode, seteditMode] = useState(false);
  const [localName, setLocalName] = useState(name);
  const handleEdit = () =>{
    seteditMode(!editMode);
  }
  const fetchReceivedMessages = async (web5, did) => {
    const response = await web5.dwn.records.query({
      from: did,
      message: {
        filter: {
          protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
          schema: "https://blackgirlbytes.dev/ding",
        },
      },
    });
    console.log("MESSAGE : ", response);

    if (response.status.code === 200) {
      const receivedDings = await Promise.all(
        response.records?.map(async (record) => {
          const data = await record.data.json();
          return data;
        })
      );
      console.log(receivedDings, "I received these dings");
      return receivedDings;
    } else {
      console.log("error", response.status);
    }
  };

  const fetchSentMessages = async (web5, did) => {
    const response = await web5.dwn.records.query({
        message: {
            filter: {
                protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
            },
        },
    });

    if (response.status.code === 200) {
        const sentDings = await Promise.all(
            response.records?.map(async (record) => {
                const data = await record.data.json();
                return data;
            })
        );
        return sentDings;
    } else {
        console.log("error", response.status);
    }
};

  useEffect(() => {
    console.log("I'm in UserCHatItem");
    if (web5) {
      fetchReceivedMessages(web5, did).then(meges => {
        setmessages(meges);
      });
      fetchSentMessages(web5, did).then(meges => {
        setmessages(meges);
      });
    }


  }, [did, web5]);

  return (
    // messages.length ?(
    <div onClick={onClick} className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
      <div className="w-1/4">
        <img
          src={avatar}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full flex">
{ editMode &&        <input type='text' onChange={(e) => setLocalName(e.target.value)} value={localName}></input>}
{!editMode && <div className="text-lg font-semibold" >{localName}</div>}
          <div className='flex justify-end cursor-pointer p-5' style={{width:'100%'}} onClick={handleEdit}><Pen/></div>
      </div>
      {/* <span className="text-gray-500">{  messages.length && messages[messages.length - 1].sender !== did ? `me : ${messages.length ? messages[messages.length - 1].note : ""}` : (messages.length ? messages[messages.length - 1].note :null)}</span> */}

    </div>
  )
}