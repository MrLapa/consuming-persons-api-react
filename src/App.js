import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import "./App.css";
import PersonsList from "./person/PersonsList";

//Using fetch API without third party libraries
const ALL_PERSONS = gql`
  query AllPersons {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

const GET_PERSON = gql`
  query Query($name: String!) {
    findPerson(name: $name) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

const ADD_PERSON_MUTATION = gql`
  mutation AddPerson(
    $name: String!
    $phone: String!
    $street: String!
    $city: String!
  ) {
    addPerson(name: $name, phone: $phone, street: $street, city: $city) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [skipValue, setSkipValue] = useState(true);
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputStreet, setInputStreet] = useState("");
  const [inputCity, setInputCity] = useState("");

  const { data, loading, error } = useQuery(ALL_PERSONS);
  const {
    loading: loadingPerson,
    error: errorPerson,
    data: dataPerson,
    refetch: refetchPerson,
  } = useQuery(GET_PERSON, {
    skip: skipValue, // Skip initial automatic fetch
    variables: { name: inputValue },
  });
  const [
    addPerson,
    { data: dataNewPerson, loading: loadingNewPerson, error: errorNewPerson },
  ] = useMutation(ADD_PERSON_MUTATION);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setSkipValue(true);
  };

  const handleChangeName = (event) => {
    setInputName(event.target.value);
  };

  const handleChangePhone = (event) => {
    setInputPhone(event.target.value);
  };

  const handleChangeStreet = (event) => {
    setInputStreet(event.target.value);
  };

  const handleChangeCity = (event) => {
    setInputCity(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSkipValue(false);
    setIsInputDisabled(true);
    await refetchPerson();
    setIsInputDisabled(false);
  };

  const handleAddPersonSubmit = async (e) => {
    e.preventDefault();

    console.log("entradaaaaa");

    try {
      const { data: newPerson } = await addPerson({
        variables: {
          name: inputName,
          phone: inputPhone,
          street: inputStreet,
          city: inputCity,
        },
      });

      console.log("newPerson", newPerson);
    } catch (error) {
      console.log("error", error);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  if (!loading && data.allPersons.length === 0) return <p>Found no movies</p>;

  return (
    <React.Fragment>
      <div>
        <h2>Find a person</h2>
        <form onSubmit={handleSubmit}>
          <input disabled={isInputDisabled} onChange={handleChange}></input>
          <button type="submit" disabled={isInputDisabled}>
            {loadingPerson ? "Loading..." : "Submit"}
          </button>
        </form>
        {errorPerson && <p>Error: {errorPerson.message}</p>}
        {!loadingPerson && dataPerson && dataPerson.findPerson && (
          <ul>
            <li>Name:{dataPerson.findPerson.name}</li>
            <li>Phone: {dataPerson.findPerson.phone}</li>
            <li>Street: {dataPerson.findPerson.address.street}</li>
            <li>City: {dataPerson.findPerson.address.city}</li>
          </ul>
        )}
      </div>
      <div>
        <h2>Add a person</h2>
        <form onSubmit={handleAddPersonSubmit}>
          <div>
            <label>Name: </label>
            <input
              disabled={isInputDisabled}
              onChange={handleChangeName}
            ></input>
          </div>
          <div>
            <label>Phone: </label>
            <input
              disabled={isInputDisabled}
              onChange={handleChangePhone}
            ></input>
          </div>
          <div>
            <label>Street: </label>
            <input
              disabled={isInputDisabled}
              onChange={handleChangeStreet}
            ></input>
          </div>
          <div>
            <label>City: </label>
            <input
              disabled={isInputDisabled}
              onChange={handleChangeCity}
            ></input>
          </div>
          <button type="submit" disabled={loadingNewPerson}>
            {loadingNewPerson ? "Loading..." : "Add person"}
          </button>
        </form>
        {errorPerson && <p>Error: {errorPerson.message}</p>}
        {!loadingPerson && dataPerson && dataPerson.findPerson && (
          <ul>
            <li>Name:{dataPerson.findPerson.id}</li>
            <li>Name:{dataPerson.findPerson.name}</li>
            <li>Phone: {dataPerson.findPerson.phone}</li>
            <li>Street: {dataPerson.findPerson.address.street}</li>
            <li>City: {dataPerson.findPerson.address.city}</li>
          </ul>
        )}
      </div>
      <section>
        <h1>GraphQL Persons</h1>
      </section>
      <section>
        <h1>GraphQL Persons Apollo Provider</h1>
      </section>
      <section>
        {!loading && data.allPersons.length > 0 && (
          <PersonsList movies={data.allPersons} />
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
