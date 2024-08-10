import styled from "styled-components";

import { useDarkMode } from "../context/DarkModeContext";
import { Link } from "react-router-dom";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  return (
    <Link to="/">
      <StyledLogo>
        <Img
          src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"}
          alt="Logo"
        />
      </StyledLogo>
    </Link>
  );
}

export default Logo;
