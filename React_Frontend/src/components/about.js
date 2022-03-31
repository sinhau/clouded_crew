import React from 'react'

export default function About({myRef}) {

    return (
        <div ref={myRef} className={"About"}>
            <h1>Mission</h1>
            <p>
            Our mission is to onboard more creatives to the NFT space by giving them the support and funding they need to build their own project. We also are committing 10% of mint sales and 0.333% of royalties to charities that support art programs in the school system.
            </p>
        </div>
    )
}
