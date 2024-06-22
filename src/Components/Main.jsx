import React, { useState } from "react";
import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import style from "../Css/Main.module.css";

const Main = ({ setEmail }) => {

  //Initial State for formData
  const initialState = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialState);

  // Backend URL stored in .env for security purpose 
  //This is how we use .env in VITE
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Setting the state of button to loading or not 
  const [isloading, setIsLoading] = useState(false);

  // Inbuild toast in Chakra UI
  const toast = useToast();

  // Change the formData by using the name and value of the attribute
  const changed = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Email validation using Regex
  function validateEmail(email) {
    // Regular expression to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern
    return emailPattern.test(email);
  }

  //Cheching if the attribute are empty of not
  const validation = () => {
    const { name, email, phone, address } = formData;
    if (!name) {
      toast({
        title: `Please Fill the Name`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } else if (!email) {
      toast({
        title: `Please fill the Email`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } else if (!validateEmail(email)) {
      toast({
        title: `Please Fill the correct Email`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } else if (!phone) {
      toast({
        title: `Please fill the phone`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } else if (!address) {
      toast({
        title: `Please fill the address`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } else {
      return true;
    }
  };

  //Submit form Function
  const submitForm = async (e) => {

    //Preventing default form submission
    e.preventDefault();
  
    //condition for checking validation
    if (validation() === true) {
      try {

        //Setting the loading true for button
        setIsLoading(true);

        //Used fetch to make api call
        const response = await fetch(`${API_URL}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData?.name,
            email: formData?.email,
            phone: formData?.phone,
            address: formData?.address,
          }),
        });

        //getting the data and converting to json
        const userdata = await response.json();
        console.log(userdata);

        // Checking if received data is error or not

        if (userdata.error) {

          //This is how to use toast of chakra ui

          toast({
            title: userdata?.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
        } else {
          setEmail(formData?.email);
          toast({
            title: "Submitted Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
          e.target.reset()
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went Wrong !!!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } else {
    }
  };

  //Storing formItems in array for iterating purpose
  const formItems = [
    {
      inp: "name",
      placeholder: "Name...",
      type: "text",
    },
    {
      inp: "email",
      placeholder: "Email...",
      type: "email",
    },
    {
      inp: "phone",
      placeholder: "Phone...",
      type: "number",
    },
    {
      inp: "address",
      placeholder: "Address",
      type: "text",
    },
  ];

  return (
    <div className={style.main}>
      <form action="" onSubmit={submitForm} className={style.form}>
        <Stack spacing={6}>
          {formItems?.map((elem, i) => {
            //Iterating the form
            const attr = elem?.inp;
            return (
              <Input
                placeholder={elem?.placeholder}
                width={400}
                _placeholder={{ color: "white" }}
                type={elem?.type}
                key={i}
                onChange={changed}
                name={attr}
                value={formData?.attr}
              />
            );
          })}
          <Button
            bgColor={"transparent"}
            color={"white"}
            type="submit"
            border={"2px solid white"}
            _hover={{ color: "black", bgColor: "aliceblue" }}
            isLoading={isloading}
            _loading={{ bgColor: "transparent" }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default Main;
