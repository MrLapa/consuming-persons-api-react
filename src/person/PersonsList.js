import React from "react";
import classes from "./PersonsList.module.css";
import Person from "./Person";

const PersonsList = (props) => {
  return (
    <ul className={classes["persons-list"]}>
      {props.movies.map((person) => (
        <Person
          key={person.id}
          name={person.name}
          phone={person.phone}
          address={person.address}
        />
      ))}
    </ul>
  );
};

export default PersonsList;
