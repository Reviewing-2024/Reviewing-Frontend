import React, { useState, useEffect } from "react";
import Header2 from "./header2";
import MobileHeader from "./MobileHeader";

const ResponsiveHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile ? <MobileHeader /> : <Header2 />;
};

export default ResponsiveHeader;