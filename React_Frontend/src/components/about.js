import React from "react";
// import GIF from "../assets/gif.gif";
import Image from "../assets/mission.jpg";

export default function About({ myRef }) {
  return (
    <div ref={myRef} className={"About"}>
      <h1>Mission</h1>
      <div className="AboutCon">
        {/* <img src={GIF}/> */}
        <img src={Image} />
        <div className="AboutRight">
          <p>
            Our goal from day one of starting this project has remained the
            same, to create awesome artwork that we can all share thru NFT
            technology and support the amazing independent creators and
            developers in the space! We are proud to say that we are doing
            exactly that, and are now ready to share our first project Clouded
            Crew. 
              <br/>  We believe in creativity, dreams, and wandering. We encourage you
            all to let your curiosity guide you and to allow yourself to fully
            immerse in the creative process.
          </p>
        </div>
      </div>
    </div>
  );
}
