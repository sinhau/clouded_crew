import React,{useState} from 'react'
import '../style.css';

export default function FAQ({myRef}) {
    const [open, setOpen] = useState(null);
    const onOpen=(val)=>{
        if(val == open){
            setOpen(null)
        }else{
            setOpen(val)
        }
    }
    return (
        <div ref={myRef} className={"FAQ"}>
            <h1>FAQ</h1>
            <div className={"FAQCon"}>
                <div className='FAQQuCon' onClick={()=>onOpen(0)}>
                    <h2>What is Clouded Crew?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 0?"-" : "+"}</h2>
                </div>
                <div className={open == 0? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>Clouded Crew is a collection of 3,333, 3D-rendered cloud PFP NFT’s on the Ethereum blockchain.</h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(1)}>
                    <h2>Why was the Clouded Crew started?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 1?"-" : "+"}</h2>
                </div>
                <div className={open == 1? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>I started this project bc in my childhood I lived in my head. During class I always found myself daydreaming about something, my head was always in the clouds. We want to give back to the next generation of creatives, and allow people to dream, wander, and believe - that is the mission.
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(2)}>
                    <h2>How many Crew Members?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 2?"-" : "+"}</h2>
                </div>
                <div className={open == 2? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>There will be 3,333 in total with 333 of them going to WL collaborations. 
                *33 will be held for the project wallet
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(3)}>
                    <h2>What is the mint price?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 3?"-" : "+"}</h2>
                </div>
                <div className={open == 3? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                All WL mints (333) will be FREE + Gas. Remaining will be 0.0333 ETH. It was important to us to make this collection on the cheaper side, with seeing many cash grabby looking projects in the market at the moment.
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(4)}>
                    <h2>Is there a mint limit?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 4?"-" : "+"}</h2>
                </div>
                <div className={open == 4? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                Yes, the maximum limit to mint	 per wallet during the WL sale will be 1 and 3 for public sale. 
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(5)}>
                    <h2>Wen mint?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 5?"-" : "+"}</h2>
                </div>
                <div className={open == 5? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                TBD
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(6)}>
                    <h2>Which charity will the money be donated to?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 6?"-" : "+"}</h2>
                </div>
                <div className={open == 6? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                The final charity will be chosen by the Clouded Council, royalty donations will be donated on a month to month/quarterly basis
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(7)}>
                    <h2>What is the roadmap?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 7?"-" : "+"}</h2>
                </div>
                <div className={open == 7? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                Project collaborations and WL giveaways<br/>
                Mint day<br/>
                Establish the Clouded Council<br/>
                Host community events<br/>
                Onboard and grant our first creative
                </h2>
                </div>
                <div className='FAQQuCon' onClick={()=>onOpen(8)}>
                    <h2>What is the utility?</h2>
                    <h2 style={{color:"rgba(255,255,255,0.8)"}}>{open == 8?"-" : "+"}</h2>
                </div>
                <div className={open == 8? 'FAQAnCon FAQShow':'FAQAnCon'}>
                <h2>
                The utility behind Clouded Crew lies in the grants that we give to the creatives decided on by the Clouded Council. In return for funding by the treasury, the creative will guarantee WL spots for the community among other perks.
                </h2>
                </div>
            </div>
        </div>
    )
}