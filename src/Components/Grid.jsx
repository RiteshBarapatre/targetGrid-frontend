import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";


const Grid = ({email,setEmail}) => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

  //Storing info fetched from mongo db
  const [info,setInfo] = useState({
    name : "",
    email : "",
    phone : "",
    address : ""
  })

  const [isLoading,setIsLoading] = useState(false)

  const toast = useToast()

  //useEffect function used to run according to change in dependencies 
  useEffect(()=>{

  const func = async ()=>{
    try {
      const userdata = await fetch(`${API_URL}/userdata/${email}`,{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json'
        }
      })
      const data = await userdata.json()
      setInfo({
        name : data?.name,
        email : data?.email,
        phone : data?.phone,
        address : data?.address
      })
    } catch (error) {
      console.log(error)
    }
     }
     email ? func() : ""
  },[email])


  // function for pushing to CRM
  const pushToCRM = async()=>{
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/pushtocrm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: info?.name,
          email: info?.email,
          phone: info?.phone,
          address: info?.address,
        }),
      });
      const userdata = await response.json()
      console.log(userdata);
      if(userdata.error){
        toast({
          title: userdata?.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
      }
      else{
        toast({
          title: `Data Pushed to CRM`,
          status:"success",
          duration: 3000,
          isClosable: true,
        })
        setIsLoading(false)
        setEmail(false)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: `Something went wrong`,
        status:"error",
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
    }
   
  }

  // rendering only if email is present in backend
  return email && (
    <div style={{display : "flex",justifyContent : "center","alignItems" : "center",margin : "50px",flexDirection : "column"}}>
      <TableContainer>
        <Table variant="simple" width={"20vw"} border={"2px solid white"}>
          <Thead>
            <Tr>
              <Th>Attributes</Th>
              <Th>Info</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Name</Td>
              <Td>{info?.name}</Td>
            </Tr>
            <Tr>
              <Td>Email</Td>
              <Td>{info?.email}</Td>  
            </Tr>
            <Tr>
              <Td>Phone</Td>
              <Td>{info?.phone}</Td>
            </Tr>
            <Tr>
              <Td>Address</Td>
              <Td>{info?.address}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <div className="pushToCRM" style={{margin : "20px 0"}}>
      <Button
            bgColor={"aliceblue"}
            color={"black"}
            onClick={pushToCRM}
            border={"2px solid white"}
            _hover={{ color: "white", bgColor: "transparent" }}
            isLoading={isLoading}
            _loading={{ bgColor: "transparent" }}
          >
            Push To CRM ↑
          </Button>
      </div>  
    </div>
  );
};

export default Grid;
