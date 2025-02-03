import React, { useState, useEffect } from "react";

import Header2 from "./header2";
import MypageMobileHeader from "./MobileMypageHeader"

const ResponsiveHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile ? <MypageMobileHeader /> : <Header2 />;
};

export default ResponsiveHeader;