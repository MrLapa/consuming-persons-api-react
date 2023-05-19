import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

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

function App() {
  const { data, loading, error } = useQuery(ALL_PERSONS);
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [skipValue, setSkipValue] = useState(true);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setSkipValue(true);
  };

  const {
    loading: loadingPerson,
    error: errorPerson,
    data: dataPerson,
    refetch: refetchPerson,
  } = useQuery(GET_PERSON, {
    skip: skipValue, // Skip initial automatic fetch
    variables: { name: inputValue },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSkipValue(false);
    setIsInputDisabled(true);
    await refetchPerson();
    setIsInputDisabled(false);
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
