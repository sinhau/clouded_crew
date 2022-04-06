import React from 'react'
// import GIF from "../assets/gif.gif";
import Image from "../assets/mission.jpg"

export default function About({myRef}) {

    return (
        <div ref={myRef} className={"About"}>
            <h1>Mission</h1>
            <div className='AboutCon'>
            {/* <img src={GIF}/> */}
            <img src={Image}/>
            <div className='AboutRight'>
            <p>
            Our mission is to onboard more creatives to the NFT space by giving them the support and funding they need to build their own project. We also are committing 10% of mint sales and 0.333% of royalties to charities that support art programs in the school system.
            </p>
            </div>
            </div>
        </div>
    )
}
