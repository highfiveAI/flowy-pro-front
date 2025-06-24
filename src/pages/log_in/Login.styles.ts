import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const LoginFormContainer = styled.form`
  max-width: 500px;
  width: 90%;
  padding: 40px;
  text-align: center;
  border-radius: 35px;
  background: #fff;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.2);
  margin-top: 80px;
`;

// const LogoImg = styled.img`
//   width: 120px;
//   height: auto;
//   margin-bottom: 20px;
// `;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border: 1px solid #c6c6c7;
  border-radius: 0px;
  background: transparent;
  padding: 0px 16px;
  height: 80px;
`;

export const InputLabel = styled.label`
  color: #333;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width: 80px;
  flex-shrink: 0;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0px;
  border-radius: 0px;
  border: none;
  background: transparent;
  font-size: 18px;
  box-sizing: border-box;
  color: black;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  flex-grow: 1;
  height: 100%;
  outline: none;
`;

export const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 8px;
  margin-bottom: 0px;
  text-align: center;
`;

export const LoginButton = styled.button`
  display: flex;
  height: 66px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  border-radius: 8px;
  background: #480b6a;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #35084d;
  }
`;

export const GoogleLoginButton = styled.button`
  width: 100%;
  height: 66px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #480b6a;
  background: #fff;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;

  img {
    width: 20px;
    height: 20px;
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  margin-top: 20px;

  a {
    color: #717171;
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
