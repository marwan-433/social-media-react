import {
  Alert,
  Button,
  FieldError,
  Input,
  Spinner,
  TextField,
} from "@heroui/react";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginSchemaType,
} from "../../lib/Auth.schema";
import { loginUser} from "../../services/auth.service";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { TokenContext } from "../../Components/Context/tokenContext";

function login() {
  const [successMessage, setsuccessMessage] = useState("");
  const [errorMessage, seterrorMessage] = useState("");

  const navigate = useNavigate();
  const {settoken} = useContext(TokenContext)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submitData(values: LoginSchemaType) {
    setsuccessMessage("");
    seterrorMessage("");
    console.log(values);
    try {
      const response = await loginUser(values);
      console.log(response);

      console.log(response.data.data.token);
      
      localStorage.setItem("userToken" ,response.data.data.token);
      settoken(response.data.data.token)
      console.log(response.data.message);
      // setsuccessMessage(response.data.message);
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
        style: { background: "green", color: "white" },
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
        // seterrorMessage(error.response?.data?.message);
        toast.error(error.response?.data?.message, {
          duration: 4000,
          position: "top-right",
          style: { background: "red", color: "white" },
        });
      }
    }
  }

  return (
    <>
      <main>
        <section className="p-7 bg-white rounded-2xl">
          <h1 className="text-2xl font-black text-main">
            Log in to Route Posts
          </h1>
          <p>Log in and continue your social journey.</p>

          {successMessage && (
            <>
              <Alert status="success" className="bg-green-200 mt-3">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{successMessage}</Alert.Title>
                </Alert.Content>
              </Alert>
            </>
          )}

          {errorMessage && (
            <>
              <Alert status="danger" className="bg-red-200 mt-3">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{errorMessage}</Alert.Title>
                </Alert.Content>
              </Alert>
            </>
          )}

          <form className="space-y-4 pt-6" onSubmit={handleSubmit(submitData)}>
            
            
            <TextField
              aria-label="email"
              className="w-full"
              isInvalid={Boolean(errors.email)}
            >
              <Input
                {...register("email")}
                aria-label="email"
                type="Email"
                className="w-full"
                placeholder="Email"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="password"
              className="w-full"
              isInvalid={Boolean(errors.password)}
            >
              <Input
                {...register("password")}
                aria-label="password"
                type="Password"
                className="w-full"
                placeholder="Password"
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>

            <Button
              type="submit"
              className="bg-main w-full text-md font-bold rounded-md"
            >
              {isSubmitting ? (
                <div className="flex gap-2">
                  {" "}
                  <Spinner className="text-white" />
                  <p>loading...</p>
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}

export default login;
