import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  min-height: 100vh;
  font-family: 'Rethink Sans', sans-serif;
`;

export const FormContainer = styled.div`
  background-color: white;
  padding: 40px 60px;
  border-radius: 35px;
  width: 100%;
  max-width: 533px;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #480b6a;
  margin-bottom: 40px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #c6c6c7;
  padding: 0 16px;
  height: 50px;
`;

export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  margin-right: 20px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
`;

export const StyledAsterisk = styled.span`
  color: #ed6e00;
  margin-left: 2px;
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: black;

  &::placeholder {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }
`;

export const Select = styled.select`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: black;

  &::placeholder {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }
`;

export const SubmitButton = styled.button`
  height: 66px;
  border-radius: 8px;
  background-color: #480b6a;
  color: white;
  font-size: 18px;
  font-weight: 700;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #35084d;
  }
`;

export const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-bottom: 15px;
  margin-left: 170px;
`;
