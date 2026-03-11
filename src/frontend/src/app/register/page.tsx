import { useReducer } from "react";
import { Link } from "react-router";
import SubmitButton from "../../shared/ui/SubmitButton";
import FlexContainer from "../../shared/ui/FlexContainer";
import Input from "../../shared/ui/Input";
import LabelInputBlock from "../../shared/ui/LabelInputBlock";
import TextInput from "../../shared/ui/TextInput";

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  submitPassword: string;
}

const initialFormState: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  submitPassword: "",
};

enum ReducerAction {
  "SET_FIRST_NAME",
  "SET_LAST_NAME",
  "SET_EMAIL",
  "SET_PASSWORD",
  "SET_SUBMIT_PASSWORD",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: FormState, action: any) {
  switch (action.type) {
    case ReducerAction.SET_FIRST_NAME:
      return {
        ...state,
        firstName: action.firstName,
      };
    case ReducerAction.SET_LAST_NAME:
      return {
        ...state,
        lastName: action.lastName,
      };
    case ReducerAction.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case ReducerAction.SET_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    case ReducerAction.SET_SUBMIT_PASSWORD:
      return {
        ...state,
        submitPassword: action.submitPassword,
      };
    default:
      console.error("Undefined action");
      return state;
  }
}

export default function RegisterPage() {
  const [formState, dispatch] = useReducer(reducer, initialFormState);

  const onSubmit = () => {};

  return (
    <FlexContainer flexDir="col" justify="center" align="center">
      <h1 className="text-2xl">Регистрация</h1>
      <form
        className="form flex flex-col justify-center items-center gap-2"
        id="register-form"
      >
        <LabelInputBlock htmlFor="firstName" label="Имя">
          <TextInput
            value={formState.firstName}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_FIRST_NAME });
            }}
            id="firstName"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="lastName" label="Фамилия">
          <TextInput
            value={formState.lastName}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_LAST_NAME });
            }}
            id="lastName"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="email" label="Почта">
          <Input
            type="email"
            value={formState.email}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_EMAIL });
            }}
            id="email"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="password" label="Пароль">
          <Input
            type="password"
            value={formState.password}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_PASSWORD });
            }}
            id="password"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="submitPassword" label="Подтвердите пароль">
          <Input
            type="password"
            value={formState.password}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_SUBMIT_PASSWORD });
            }}
            id="submitPassword"
            required
          />
        </LabelInputBlock>
      </form>
      <FlexContainer
        flexDir="col"
        justify="center"
        align="center"
        className="mt-6 gap-4"
      >
        <SubmitButton formId="register-form" onClick={onSubmit}>
          Зарегистрироваться
        </SubmitButton>
        <Link to="/login">Войти</Link>
      </FlexContainer>
    </FlexContainer>
  );
}
