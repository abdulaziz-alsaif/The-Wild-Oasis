import { Navigate } from "react-router-dom";

import { useUser } from "../features/authentication/useUser";

import styled from "styled-components";

import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoutes({ children }) {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoutes;
