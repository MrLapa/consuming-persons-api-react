import React from "react";
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

function App() {
  const { data, loading, error } = useQuery(ALL_PERSONS);

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  if (!loading && data.allPersons.length === 0) return <p>Found no movies</p>;

  console.log("message");

  return (
    <React.Fragment>
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
