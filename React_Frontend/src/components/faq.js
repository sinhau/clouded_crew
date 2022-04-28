import React, { useState } from "react";
import "../style.css";

export default function FAQ({ myRef }) {
  const [open, setOpen] = useState(null);
  const onOpen = (val) => {
    if (val == open) {
      setOpen(null);
    } else {
      setOpen(val);
    }
  };
  return (
    <div ref={myRef} className={"FAQ"}>
      <h1>FAQ</h1>
      <div className={"FAQCon"}>
        <div className="FAQQuCon" onClick={() => onOpen(0)}>
          <h2>What is Clouded Crew?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 0 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 0 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            Clouded Crew is a collection of 3,333, 3D-rendered cloud PFP NFT’s
            on the Ethereum blockchain.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(1)}>
          <h2>Why was the Clouded Crew started?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 1 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 1 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            From our founder Natureboy, I started this project because in my
            childhood I lived in my head a lot. During class I always found
            myself daydreaming about something - my head was always in the
            clouds. I wanted to share that feeling of allowing yourself to be
            truly curious again back into the world and support the next
            generation of creatives. To allow people to dream, wander, and
            believe - that is my mission. I hope that people who see our
            creations will appreciate all the hard work and hundreds of hours we
            put into each project and cant wait to share it for the world to
            see.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(2)}>
          <h2>How many Crew Members?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 2 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 2 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            There will be 3,333 in total with 333 of them going to WL
            collaborations. *33 will be held for the project wallet
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(3)}>
          <h2>What is the mint price?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 3 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 3 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            All WL mints (333) will be FREE + Gas. Remaining will be TBA in ETH.
            It was important to us to make this collection on the cheaper side,
            with seeing many cash grabby looking projects in the market at the
            moment.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(4)}>
          <h2>Is there a mint limit?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 4 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 4 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            Yes, the maximum limit to mint per wallet during the WL sale will be
            1 and 3 per transaction during the public sale.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(5)}>
          <h2>Wen mint?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 5 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 5 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            TBA - follow us on our Twitter and Discord for updated information.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(6)}>
          <h2>How do I get on WL?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 6 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 6 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            We are doing Twitter partnerships and giveaways, and will be hosting
            community events/contests in the coming days. <br/>
            Cloud Member = WL{" "}
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(7)}>
          <h2>What is the roadmap?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 7 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 7 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            As we are an art project we dont want to box ourselves in with a
            roadmap and defined things to do. We are creatives first, we value
            being able to !drift and allow ourselves to create as we please.
            When something feels like a job, it take the fun out of doing what
            we love so for now we can only promise one thing - that we are
            constantly working on more creations to share.
          </h2>
        </div>
        <div className="FAQQuCon" onClick={() => onOpen(8)}>
          <h2>What is the utility?</h2>
          <h2 style={{ color: "rgba(255,255,255,0.8)" }}>
            {open == 8 ? "-" : "+"}
          </h2>
        </div>
        <div className={open == 8 ? "FAQAnCon FAQShow" : "FAQAnCon"}>
          <h2>
            By being a Crew Member, holding one of our NFTs will grant you to
            holder only access to our next creations and first dibs on projects
            we are working on. We are working on a lot of cool things in the
            background, we can't wait to share them with you.
          </h2>
        </div>
      </div>
    </div>
  );
}
